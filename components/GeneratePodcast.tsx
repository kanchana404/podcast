import { GeneratePodcastProps } from "@/types";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { error } from "console";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {v4 as uuidv4} from 'uuid';
import { useUploadFiles } from "@xixixao/uploadstuff/react";

const useGeneratePodcast = ({
    setAudio,
    voiceType,
    voicePrompt,
    setAudioStorageId
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const {startUpload} = useUploadFiles(generateUploadUrl)

  const getPodcastAudio = useAction(api.openai.generateAudioAction)

  const getAudioUrl = useMutation(api.podcast.getUrl);

  const generatePodcast = async () => {

    setIsGenerating(true);
    setAudio("");

    if(!voicePrompt){
        // todo: show error message
        return setIsGenerating(false);
    }

    try {

        const response = await getPodcastAudio({
            voice:voiceType,
            input: voicePrompt
        })

      
      const blob = new Blob([response], { type: 'audio/mpeg' });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setAudioStorageId(storageId);

        const audioUrl = await getAudioUrl({storageId});
        
    } catch (error) {
        console.log('Error while generating audio', error);
        // todo: show error message 
        setIsGenerating(false);
    }

  };

  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

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
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
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

      {props.audio && (
        <audio
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedData={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
