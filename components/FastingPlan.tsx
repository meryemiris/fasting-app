import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

interface FastingPlanProps {
	plan: { id: number; name: string; description: string };
	onSelect: (id: number) => void;
	selected: boolean;
}

const FastingPlan: React.FC<FastingPlanProps> = ({
	plan: { id, name, description },
	onSelect,
	selected,
}) => {
	const planBgColor = selected ? "#db00b6" : "#606060";

	return (
		<TouchableOpacity
			style={[styles.card, { backgroundColor: planBgColor }]}
			onPress={() => onSelect(id)}
		>
			<ThemedText type="title">{name}</ThemedText>
			<ThemedText type="default">{description}</ThemedText>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		flexDirection: "column",
		margin: 10,
		padding: 20,
		borderRadius: 10,
	},
});

export default FastingPlan;
