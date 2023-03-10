import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Recorded from "../assets/Validation/Recorded.svg"
import RecordedMark from "../assets/Validation/RecordedMark.svg"
import Spacer from '../components/Spacer'
import Button from '../components/Button'
import { widthPercentageToDP } from '../constants/Layout'

const RecordedTicket = ({ route, navigation }) => {
  const doneHandler = () => navigation.pop();
  function updateTicket(ticketId) {
    fetch(`https://e-ticket-server.onrender.com/api/scanner/tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isscanned: true
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Resource updated successfully:', data);
        console.log(data)
      })
      .catch(error => {
        console.error('There was a problem updating the resource:', error);
      });

  }
  return (
    <LinearGradient colors={['#FF7A00', '#FFFFFF']} style={styles.container}>
      <View style={{ position: "relative", flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
          <Recorded />
          <View style={{ position: "absolute", top: widthPercentageToDP("10%"), alignItems: "center", justifyContent: "center" }}>
            <RecordedMark />
            <Spacer />
            <Text style={{ fontSize: 18, fontWeight: "900", color: "#000000" }}>Ticket Valide</Text>
            <Spacer />
            <Text style={{ color: "#808080", fontSize: 12 }}>Event ID: KBHD6G</Text>
            <Text style={{ color: "#808080", fontSize: 12 }}>Ticket ID: K8HD6-6BJG-GTU8</Text>
            <Spacer />
            <Text style={{ color: "#808080", fontSize: 12 }}>Seat Category</Text>
            <Spacer />
            <Text style={{ fontSize: 18, fontWeight: "900", color: "#000000" }}>Back Stage</Text>
          </View>

          <View style={{ position: "absolute", bottom: widthPercentageToDP("7%"), width: "75%" }}>
            <Text style={{ color: "#808080", fontSize: 16, fontWeight: "400", textAlign: "left" }}>Ticket Holder</Text>
            <Spacer size={5} />
            <View style={{ borderRadius: 10, backgroundColor: "#80808033", width: "100%", padding: 10, alignItems: "center", gap: 10, flexDirection: "row" }}>
              <View style={{ backgroundColor: "#97C396", borderRadius: 40, height: 40, width: 40 }}>
              </View>
              <View style={{ flexDirection: "column", width: "100%" }}>
                <Text style={{ color: "#000000", fontSize: 16, fontWeight: "600" }}>Olay Bemiline</Text>
                <Text style={{ fontSize: 14, width: widthPercentageToDP("55%") }} numberOfLines={1} ellipsizeMode={"tail"}>Friday, February 18 2023, 12:47:39</Text>
              </View>
            </View>
          </View>
        </View>

      </View>
      <View>
        <Button title={"Attendance Record"} onPress={() => updateTicket(route.params.ticket_id)} backgroundColor="#FF7A00" textColor='white' width={300} />
        <Spacer />
        <Button title={"Done"} onPress={doneHandler} backgroundColor="transparent" textColor='#FF7A00' width={300} borderColor="#FF7A00" />
        <Spacer size={15} />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default RecordedTicket