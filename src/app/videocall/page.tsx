import dynamic from "next/dynamic";
import dotenv from "dotenv";

dotenv.config();

const appId = process.env.AGORA_API_KEY;

const VideoCall = dynamic(
  () => import("../../components/videocall/VideoCall"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const HomePage = () => <VideoCall appId={appId || ""} />;

export default HomePage;
