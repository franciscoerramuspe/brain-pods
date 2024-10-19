import dynamic from "next/dynamic";
import dotenv from "dotenv";

dotenv.config();

const appId = process.env.AGORA_API_KEY;

const AgoraComponent = dynamic(
  () => import("../../components/videocall/AgoraComponent"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const HomePage = () => <AgoraComponent appId={appId || ""} />;

export default HomePage;
