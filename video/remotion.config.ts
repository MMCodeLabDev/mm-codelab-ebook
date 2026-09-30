import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
// High quality for social upload (platforms re-encode anyway).
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
