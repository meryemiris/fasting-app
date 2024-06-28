import { StyleSheet, SafeAreaView, View, ScrollView } from "react-native";

import FastingTracker from "@/components/FastingTracker";
import FastingPlan from "@/components/FastingPlan";
import { useState } from "react";

type Plan = {
	id: number;
	name: string;
	description: string;
	fastTime: number;
	eatTime: number;
};

export default function HomeScreen() {
	const [selectedPlan, setSelectedPlan] = useState(1);
	const plans: Plan[] = [
		{
			id: 1,
			name: "16:8",
			description: "16 hours of fast with 8 hours of eating.",
			fastTime: 16,
			eatTime: 8,
		},
		{
			id: 2,
			name: "17:7",
			description: "17 hours of fast with 7 hours of eating.",
			fastTime: 17,
			eatTime: 7,
		},
		{
			id: 3,
			name: "18:6",
			description: "18 hours of fast with 6 hours of eating.",
			fastTime: 18,
			eatTime: 6,
		},
	];

	const handleSelectPlan = (planId: number) => {
		setSelectedPlan(planId);
	};
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					margin: 10,
				}}
			>
				<ScrollView
					decelerationRate="fast"
					snapToInterval={364}
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.planContainer}
				>
					{plans.map((plan) => (
						<FastingPlan
							key={plan.id}
							plan={plan}
							selected={selectedPlan == plan.id}
							onSelect={handleSelectPlan}
						/>
					))}
				</ScrollView>
			</View>
			<FastingTracker
				fastTime={plans[selectedPlan - 1].fastTime}
				eatTime={plans[selectedPlan - 1].eatTime}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	planContainer: {
		flexDirection: "row",
		// paddingHorizontal: 16,
		// paddingVertical: 8,
	},
});
