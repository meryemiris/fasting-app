import { StyleSheet, SafeAreaView } from "react-native";

import { ThemedText } from "@/components/ThemedText";

export default function TabTwoScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<ThemedText type="title">Profile</ThemedText>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
