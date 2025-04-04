import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("✅ Connected to Redis");
    } catch (error) {
        console.error("❌ Redis Connection Failed:", error);
    }
};

connectRedis();

export default redisClient;
