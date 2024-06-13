import { GeneratePodcastProps } from "@/types";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

const useGeneratePodcast = (props: GeneratePodcastProps) => {
  return {
    isGenerating: false,
    generatePodcast: () => {},
  };
};

const GeneratePodcast = ({
  setAudioStorageId,
  setAudio,
  voiceType,
  audio,
  voicePrompt,
  setVoicePrompt,
  setAudioDuration,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div>
      <div className="flex flex-col gap=2.4">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1 mt-5"
          placeholder="Provide text to generate audio"
          rows={5}
          value={voicePrompt}
          onChange={(e) => setVoicePrompt(e.target.value)}
        />
      </div>

      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 font-bold bg-orange-1 py-4 text-white-1"
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {audio && (
        <audio
          src={audio}
          autoPlay
          className="mt-5"
          onLoadedData={(e) => setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
