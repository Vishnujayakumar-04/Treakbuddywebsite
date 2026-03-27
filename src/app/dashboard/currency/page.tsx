'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, Clock, MapPin, Phone, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EXCHANGE_LOCATIONS, SUPPORTED_CURRENCIES } from '@/services/currencyService';

type LocationFilter = 'All' | 'Bank' | 'Forex' | 'ATM';

export default function CurrencyExchangePage() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('INR');
  const [filterType, setFilterType] = useState<LocationFilter>('All');

  const fetchRates = async () => {
    setLoadingRates(true);
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=INR');
      if (!res.ok) throw new Error(`Rates HTTP ${res.status}`);
      const data = await res.json();
      setRates(data.rates ?? null);
      setLastUpdated(data.date ? new Date(data.date).toLocaleDateString() : '');
    } catch (e) {
      console.error('Failed to fetch live rates:', e);
      setRates(null);
      setLastUpdated('');
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertedAmount = useMemo(() => {
    if (!rates) return '—';
    const n = Number(amount);
    if (!Number.isFinite(n)) return '—';
    if (fromCurrency === toCurrency) return n.toFixed(2);

    // Frankfurter response: rates[T] = T per 1 INR
    const fromRate = fromCurrency === 'INR' ? 1 : rates[fromCurrency];
    const toRate = toCurrency === 'INR' ? 1 : rates[toCurrency];
    if (!fromRate || !toRate) return '—';

    const inINR = n / fromRate;
    const out = inINR * toRate;
    return out.toFixed(2);
  }, [amount, fromCurrency, rates, toCurrency]);

  const filteredLocations = useMemo(() => {
    return EXCHANGE_LOCATIONS.filter((loc) => (filterType === 'All' ? true : loc.type === filterType));
  }, [filterType]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-screen pt-24 pb-10 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto max-w-5xl px-4 md:px-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowLeftRight className="w-6 h-6 text-emerald-600" />
              Currency Exchange
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Live mid-market rates (Frankfurter) + curated exchange locations in Puducherry.
            </p>
          </div>
          <Button variant="outline" onClick={fetchRates} disabled={loadingRates} className="rounded-xl">
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingRates ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Converter
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">From</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <SelectItem key={`from-${c.code}`} value={c.code}>
                        {c.code} {c.symbol ? `(${c.symbol})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">To</label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <SelectItem key={`to-${c.code}`} value={c.code}>
                        {c.code} {c.symbol ? `(${c.symbol})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleSwap} variant="outline" className="w-full rounded-xl">
                  Swap
                </Button>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">Converted</div>
              <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
                {loadingRates ? 'Updating…' : convertedAmount}
              </div>
              <div className="text-xs text-slate-400 mt-1">{lastUpdated ? `Rates date: ${lastUpdated}` : '—'}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Exchange locations
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as LocationFilter)}
                className="text-sm rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                <option value="All">All</option>
                <option value="Bank">Bank</option>
                <option value="Forex">Forex</option>
                <option value="ATM">ATM</option>
              </select>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
              {filteredLocations.map((loc) => (
                <div key={loc.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{loc.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{loc.address}</span>
                      </div>
                    </div>
                    <Badge className="shrink-0">{loc.type}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      {loc.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      {loc.hours}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {loc.currencies.map((c) => (
                      <Badge key={`${loc.id}-${c}`} variant="secondary">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

