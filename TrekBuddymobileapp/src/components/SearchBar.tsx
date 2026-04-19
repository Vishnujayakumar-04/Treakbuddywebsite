import { View, TextInput, StyleSheet, Text } from 'react-native';
import { spacing, radius } from '../theme/spacing';

interface SearchBarProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search destinations...',
  onChangeText,
  value,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#666666"
        onChangeText={onChangeText}
        value={value}
      />
      <Text style={styles.icon}>🔍</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: spacing.md,
    paddingRight: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    fontSize: 14,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  icon: {
    position: 'absolute',
    right: spacing.md,
    fontSize: 16,
  },
});
