import { definePluginSettings } from "@api/Settings";

export const settings = definePluginSettings({}).withPrivateSettings<{
   isPictureInPicture?: boolean
}>();
