import React, { useEffect, useState } from 'react';
import { StyleSheet, Button, Text, TextInput, View, Alert, TouchableHighlight, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import base64 from 'react-native-base64'

function HomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  let login = () => {
    fetch('http://cs571.cs.wisc.edu:5000//login/', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64.encode(username + ":" + password)
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          navigation.navigate('Profile', { username: username, token: res.token })
        } else {
          alert("Incorrect username or password! Please try again.");
        }
      });
  }

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>Welcome! Please login or signup to continue.</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="lightsteelblue"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        secureTextEntry={true}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="lightsteelblue"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      <TouchableHighlight
        style={styles.button}
        onPress={() => { login(); }}
        underlayColor='#fff'>
        <Text style={{ color: 'olive', fontSize: 18 }}>LOGIN</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => navigation.navigate('Signup')}
        underlayColor='fff'>
        <Text style={{ color: 'olive', fontSize: 18 }}>SIGNUP</Text>
      </TouchableHighlight>
    </View>
  );
}

function UserScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  let signup = () => {
    fetch('http://cs571.cs.wisc.edu:5000//users/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(res => res.json())
      .then(res => {
        alert(res.message)
        navigation.navigate('Home')
      });
  }

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>New here? Let's get started! Please create an account below.</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="lightsteelblue"
        autoCapitalize="none"
        onChangeText={setUsername}
      />

      <TextInput
        secureTextEntry={true}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="lightsteelblue"
        autoCapitalize="none"
        onChangeText={setPassword}
      />

      <TouchableHighlight
        style={styles.button}
        onPress={() => { signup(); }}
        underlayColor='fff'>
        <Text style={{ color: 'olive', fontSize: 18 }}>CREATE ACCOUNT</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
        underlayColor='fff'>
        <Text style={{ color: 'olive', fontSize: 18 }}>NEVERMIND</Text>
      </TouchableHighlight>
    </View>
  );
}

function ProfileScreen({ navigation, route }) {
  const [username, setUsername] = useState('');

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [dailyCalories, setDailyCalories] = useState(0);
  const [dailyProtein, setDailyProtein] = useState(0);
  const [dailyCarbohydrates, setDailyCarbohydrates] = useState(0);
  const [dailyFat, setDailyFat] = useState(0);
  const [dailyActivity, setDailyActivity] = useState(0);

  const [info, setInfo] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetch('http://cs571.cs.wisc.edu:5000//users/' + route.params.username, {
      method: 'GET',
      headers: {
        'x-access-token': route.params.token
      },
    })
      .then(res => res.json())
      .then(res => {
        if (isMounted){
          setInfo(res)
        }
      });
      return () => {isMounted = false}
  })

  let profile = () => {
    fetch('http://cs571.cs.wisc.edu:5000//users/' + route.params.username, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': route.params.token
      },
      body: JSON.stringify({
        firstName: firstname,
        lastName: lastname,
        goalDailyCalories: dailyCalories,
        goalDailyProtein: dailyProtein,
        goalDailyCarbohydrates: dailyCarbohydrates,
        goalDailyFat: dailyFat,
        goalDailyActivity: dailyActivity
      })
    })
      .then(res => res.json())
      .then(res => {
        alert(res.message)
      });
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', padding: 10, fontWeight: "bold", fontSize: 35 }}>About Me</Text>
        <Text style={{ textAlign: 'center', padding: 10, fontSize: 18 }}>Let's get to know you! Specify your information below.</Text>
        <Text style={{ textAlign: 'center', padding: 10, fontWeight: "bold", fontSize: 30 }}>Personal Information</Text>
        <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }}>First Name</Text>

        <TextInput
          style={styles.input}
          placeholder={info.firstName}
          placeholderTextColor="lightsteelblue"
          autoCapitalize="none"
          onChangeText={setFirstName}
        />

        <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }}>Last Name</Text>

        <TextInput
          style={styles.input}
          placeholder={info.lastName}
          placeholderTextColor="lightsteelblue"
          autoCapitalize="none"
          onChangeText={setLastName}
        />

        <Text style={{ textAlign: 'center', padding: 10, fontWeight: "bold", fontSize: 30 }}>Fitness Goals</Text>

        <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }}>Daily Calories (kcal)</Text>
        <TextInput
          style={styles.input}
          placeholder="560"
          placeholderTextColor="lightsteelblue"
          autoCapitalize="none"
          onChangeText={setDailyCalories}
        />

        <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }}>Daily Protein (grams)</Text>
        <TextInput
          style={styles.input}
          placeholder="120"
          placeholderTextColor="lightsteelblue"
          autoCapitalize="none"
          onChangeText={setDailyProtein}
        />

        <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }}>Daily Carbs (grams)</Text>
        <TextInput
          style={styles.input}
          placeholder="50"
          placeholderTextColor="lightsteelblue"
          autoCapitalize="none"
          onChangeText={setDailyCarbohydrates}
        />

        <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }}>Daily Fat (grams)</Text>
        <TextInput
          style={styles.input}
          placeholder="70"
          placeholderTextColor="lightsteelblue"
          autoCapitalize="none"
          onChangeText={setDailyFat}
        />

        <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 20 }}>Daily Activity (mins)</Text>
        <TextInput
          style={styles.input}
          placeholder="90"
          placeholderTextColor="lightsteelblue"
          autoCapitalize="none"
          onChangeText={setDailyActivity}
        />

        <Text style={{ textAlign: 'center', fontWeight: "bold", fontSize: 30 }}>Looks Good! All Set?</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={() => { profile(); }}
          underlayColor='fff'>
          <Text style={{ color: 'olive', fontSize: 18 }}>SAVE PROFILE</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
          underlayColor='fff'>
          <Text style={{ color: 'olive', fontSize: 18 }}>EXIT</Text>
        </TouchableHighlight>
      </View>
    </ScrollView>
  )
}

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Signup" component={UserScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 23,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    marginRight: 70,
    marginLeft: 70,
    marginTop: 70,
    padding: 10,
    backgroundColor: 'darkkhaki',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    margin: 20,
    height: 40,
    borderColor: 'darkkhaki',
    borderWidth: 2,
  },
});

export default App
