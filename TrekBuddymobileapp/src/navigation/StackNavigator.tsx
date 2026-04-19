import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import TabNavigator from "./TabNavigator";
import CategoryScreen from "../screens/CategoryScreen";
import ReligiousPlacesScreen from "../screens/ReligiousPlacesScreen";
import BeachesScreen from "../screens/BeachesScreen";
import ParksScreen from "../screens/ParksScreen";
import NatureScreen from "../screens/NatureScreen";
import NightlifeScreen from "../screens/NightlifeScreen";
import AdventureScreen from "../screens/AdventureScreen";
import TheatresScreen from "../screens/TheatresScreen";
import PhotoshootScreen from "../screens/PhotoshootScreen";
import ShoppingScreen from "../screens/ShoppingScreen";
import PubsScreen from "../screens/PubsScreen";
import AccommodationScreen from "../screens/AccommodationScreen";
import RestaurantsScreen from "../screens/RestaurantsScreen";
import PlaceDetailsScreen from "../screens/PlaceDetailsScreen";
import AIDetailScreen from "../screens/AIDetailScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import TripPlannerInput from "../screens/TripPlannerInput";
import TripPlannerOutput from "../screens/TripPlannerOutput";
import TripPlannerScreen from "../screens/TripPlannerScreen";
import ExploreScreen from "../screens/ExploreScreen";
import FamousPlacesScreen from "../screens/FamousPlacesScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import AIChatbotScreen from "../screens/AIChatbotScreen";
import ProfileScreen from "../screens/ProfileScreen";
import BusHomeScreen from "../screens/bus/BusHomeScreen";
import TownBusListScreen from "../screens/bus/TownBusListScreen";
import BusRouteDetailsScreen from "../screens/bus/BusRouteDetailsScreen";
import InterCityBusScreen from "../screens/bus/InterCityBusScreen";
import RoutePlannerScreen from "../screens/RoutePlannerScreen";
import EventsScreen from "../screens/EventsScreen";
import RentalDetailScreen from "../screens/transit/RentalDetailScreen";
import TrainDetailScreen from "../screens/transit/TrainDetailScreen";
import { useAuth } from "../context/AuthContext";
import FAQScreen from "../screens/FAQScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import AboutScreen from "../screens/AboutScreen";

const Stack = createStackNavigator();

export default function StackNavigator() {
  const { user, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return null; // App.tsx already handles loading
  }

  return (
    <Stack.Navigator
      initialRouteName={!user ? "Welcome" : "Main"}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, next, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 350,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 350,
            },
          },
        },
      }}
    >
      {!user ? (
        // Unauthenticated routes
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              // No animation on initial load
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
          />
        </>
      ) : (
        // Authenticated routes
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="TripPlannerMain"
            component={TripPlannerScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Explore"
            component={ExploreScreen}
          />
          <Stack.Screen
            name="FamousPlaces"
            component={FamousPlacesScreen}
          />
          <Stack.Screen
            name="Category"
            component={CategoryScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="ReligiousPlaces"
            component={ReligiousPlacesScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Beaches"
            component={BeachesScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Parks"
            component={ParksScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Nature"
            component={NatureScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Nightlife"
            component={NightlifeScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Adventure"
            component={AdventureScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Theatres"
            component={TheatresScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Photoshoot"
            component={PhotoshootScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Shopping"
            component={ShoppingScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Pubs"
            component={PubsScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Accommodation"
            component={AccommodationScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Restaurants"
            component={RestaurantsScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="Events"
            component={EventsScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="PlaceDetails"
            component={PlaceDetailsScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="AIDetail"
            component={AIDetailScreen}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
          />
          <Stack.Screen
            name="TripPlannerInput"
            component={TripPlannerInput}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="TripPlannerOutput"
            component={TripPlannerOutput}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="AIChatbot"
            component={AIChatbotScreen}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />
          <Stack.Screen
            name="BusHome"
            component={BusHomeScreen}
          />
          <Stack.Screen
            name="TownBusList"
            component={TownBusListScreen}
          />
          <Stack.Screen
            name="BusRouteDetails"
            component={BusRouteDetailsScreen}
          />
          <Stack.Screen
            name="InterCityBus"
            component={InterCityBusScreen}
          />
          <Stack.Screen
            name="RoutePlanner"
            component={RoutePlannerScreen}
          />
          <Stack.Screen
            name="RentalDetail"
            component={RentalDetailScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen
            name="TrainDetail"
            component={TrainDetailScreen}
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen name="FAQ" component={FAQScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
