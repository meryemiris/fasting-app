import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

interface LoopingTimerProps {
	startTime: number; // Starting hour for the countdown (e.g., 16, 17, 18)
	isRunning: boolean; // Flag to indicate if the timer is running or not
}

const LoopingTimer: React.FC<LoopingTimerProps> = ({
	startTime,
	isRunning,
}) => {
	const [timeLeft, setTimeLeft] = useState<number>(
		calculateTimeLeft(startTime)
	);

	function calculateTimeLeft(currentTime: number) {
		const now = new Date();
		const target = new Date();

		// Calculate target time based on currentTime
		if (currentTime <= 24) {
			target.setHours(currentTime, 0, 0, 0); // Countdown to startTime:00:00
		} else {
			// Handle the case where startTime exceeds 24 hours
			currentTime = currentTime % 24;
			target.setHours(currentTime, 0, 0, 0); // Countdown to startTime:00:00
		}

		// If current time is already past target time, switch to the next target
		if (
			now.getHours() > currentTime ||
			(now.getHours() === currentTime &&
				now.getMinutes() === 0 &&
				now.getSeconds() === 0)
		) {
			target.setDate(target.getDate() + 1);
		}

		let diff = (target.getTime() - now.getTime()) / 1000; // Difference in seconds
		diff = diff > 0 ? diff : 0; // Ensure it's non-negative

		return Math.floor(diff);
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(calculateTimeLeft(startTime));
		}, 1000);

		return () => clearInterval(interval);
	}, [startTime]);

	// Format seconds into HH:mm:ss format
	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<View style={styles.container}>
			{isRunning ? (
				<ThemedText type="title">{formatTime(timeLeft)}</ThemedText>
			) : (
				<ThemedText type="title">{`${24 - startTime}:00:00`}</ThemedText>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
});

export default LoopingTimer;
