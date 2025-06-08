# Input Actions
```
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <div
              className={cn(
                "flex h-8 items-center justify-center gap-1.5 rounded-md transition-all text-xs border text-muted-foreground hover:bg-primary-foreground hover:text-primary",
                isLoading && "cursor-not-allowed opacity-50"
              )}
            >
              {selectedProject ? (
                <div className={cn(
                  "bg-primary-foreground text-primary px-2 h-full w-full flex items-center justify-center",
                  isLoading && "cursor-not-allowed opacity-50"
                )}>
                  <FolderCogIcon className="size-3.5" />
                  {/* <span className="max-w-[100px] truncate">{selectedProject.name}</span> */}
                </div>
              ) : (
                <div className=" px-2 h-full w-full flex items-center justify-center">
                  <FolderCogIcon className="size-3.5" />
                  {/* <span>No project selected</span> */}
                </div>
              )}
              {/* <ChevronDown className="size-3 ml-0.5 mt-0.5 text-muted-foreground" /> */}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-4">
                <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <>
                {projects.length > 0 ? (
                  <>
                    <div className="px-2 pt-1 pb-2 text-xs font-medium text-muted-foreground">
                      Your projects
                    </div>
                    {projects.map((project) => (
                      <DropdownMenuItem
                        key={project.id}
                        className="flex items-center gap-2"
                        onClick={() => handleSelectProject(project)}
                      >
                        <FolderCogIcon className="size-4 text-muted-foreground" />
                        <span className="flex-1 truncate">{project.name}</span>
                        {selectedProject?.id === project.id && (
                          <Check className="size-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    <div className="h-px my-1 bg-border" />
                  </>
                ) : (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    No projects found
                  </div>
                )}
                <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      className="flex items-center gap-2 focus:bg-primary focus:text-primary-foreground"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <FolderPlus className="size-4" />
                      <span>Create new project</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create a new project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
                      <Input
                        placeholder="Project name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isCreatingProject}
                          className="flex items-center gap-2"
                        >
                          {isCreatingProject ? (
                            <>Creating...</>
                          ) : (
                            <>
                              <Plus className="size-4" />
                              Create project
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                type="button"
                onClick={handleSearchToggle}
                disabled={isLoading}
                className={cn(
                  "text-muted-foreground hover:text-primary flex h-8 items-center justify-center gap-1.5 rounded-full border transition-all",
                  showSearch ? "bg-background border px-2" : "border-transparent",
                  isLoading && "cursor-not-allowed opacity-50"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: showSearch ? 180 : 0, scale: showSearch ? 1.1 : 1 }}
                  whileHover={{ rotate: showSearch ? 180 : 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <Globe
                    className={cn(
                      "hover:text-primary size-4",
                      showSearch ? "text-primary" : "text-muted-foreground",
                      isLoading && "cursor-not-allowed opacity-50"
                    )}
                  />
                </motion.div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-primary shrink-0 overflow-hidden whitespace-nowrap text-[11px]"
                    >
                      Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Smart Search with Web Access</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <div
              className={cn(
                "flex items-center justify-center rounded-full p-0",
                (activeCommandMode === "image-gen" || activeCommandMode === "search-mode" ||
                  activeCommandMode === "thinking-mode" || activeCommandMode === "canvas-mode") ?
                  "bg-background text-primary border" : "text-muted-foreground",
                isLoading && "cursor-not-allowed opacity-50"
              )}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <PackageOpen
                  className={cn(
                    "size-4 transition-colors",
                    (activeCommandMode === "image-gen" || activeCommandMode === "search-mode" ||
                      activeCommandMode === "thinking-mode" || activeCommandMode === "canvas-mode") ?
                      "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                />
              </motion.div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuItem onClick={handleImageSelect}>
              <Images className={cn("mr-1 size-4", activeCommandMode === "image-gen" && "text-primary")} />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImageSelect}>
              <Search className={cn("mr-1 size-4", activeCommandMode === "search-mode" && "text-primary")} />
              Search
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleThinkingSelect}>
              <Lightbulb className={cn("mr-1 size-4", activeCommandMode === "thinking-mode" && "text-primary")} />
              Thinking Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResearchSelect}>
              <CircleDotDashed className={cn("mr-1 size-4", activeCommandMode === "research-mode" && "text-primary")} />
              Research
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResearchSelect}>
              <Microscope className={cn("mr-1 size-4", activeCommandMode === "research-mode" && "text-primary")} />
              Deep Research
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCanvasSelect}>
              <NotebookPen className={cn("mr-2 size-4", activeCommandMode === "canvas-mode" && "text-primary")} />
              Canvas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
```

# Google Ai studio
```
async function main() {
const model = 'gemma-3n-e4b-it';}
main();<!--  -->
async function main() {
const model = 'gemma-3-27b-it';}
main();<!--  -->
async function main() {
const model = 'gemma-3-12b-it';}
main();<!--  -->
async function main() {
const model = 'gemma-3-4b-it';}
main();<!--  -->
async function main() {
const model = 'gemma-3-1b-it';}
main();<!--  -->
async function main() {
const model = 'gemini-1.5-flash-8b';}
main();<!--  -->
async function main() {
const model = 'gemini-1.5-flash';}
main();<!--  -->
async function main() {
const model = 'gemini-1.5-pro';}
main();<!--  -->
async function main() {
const model = 'gemini-2.0-flash-lite';}
main();<!--  -->
import mime from 'mime';
import { writeFile } from 'fs';


function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseModalities: [
        'IMAGE',
        'TEXT',
    ],
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.0-flash-preview-image-generation';
  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
      continue;
    }
    if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const fileName = `ENTER_FILE_NAME_${fileIndex++}`;
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      const fileExtension = mime.getExtension(inlineData.mimeType || '');
      const buffer = Buffer.from(inlineData.data || '', 'base64');
      saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
    }
    else {
      console.log(chunk.text);
    }
  }
}
main();<!--  -->
async function main() {
const model = 'gemini-2.0-flash';}
main();<!--  -->
async function main() {
const model = 'gemini-2.0-flash';}
main();<!--  -->
async function main() {
const model = 'gemini-2.5-flash-preview-04-17';}
main();<!--  -->
async function main() {
const model = 'gemini-2.5-pro-preview-05-06';}
main();<!--  -->
async function main() {
const model = 'learnlm-2.0-flash-experimental';}
main();<!--  -->
<!--  -->
<!--  -->// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node
import {
  GoogleGenAI,
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
} from '@google/genai';
import mime from 'mime';
import { writeFile } from 'fs';
const responseQueue: LiveServerMessage[] = [];
let session: Session | undefined = undefined;

async function handleTurn(): Promise<LiveServerMessage[]> {
  const turn: LiveServerMessage[] = [];
  let done = false;
  while (!done) {
    const message = await waitMessage();
    turn.push(message);
    if (message.serverContent && message.serverContent.turnComplete) {
      done = true;
    }
  }
  return turn;
}

async function waitMessage(): Promise<LiveServerMessage> {
  let done = false;
  let message: LiveServerMessage | undefined = undefined;
  while (!done) {
    message = responseQueue.shift();
    if (message) {
      handleModelTurn(message);
      done = true;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  return message!;
}

const audioParts: string[] = [];
function handleModelTurn(message: LiveServerMessage) {
  if(message.serverContent?.modelTurn?.parts) {
    const part = message.serverContent?.modelTurn?.parts?.[0];    if(part?.fileData) {
      console.log(`File: ${part?.fileData.fileUri}`);
    }    if (part?.inlineData) {
      const fileName = 'audio.wav';
      const inlineData = part?.inlineData;      audioParts.push(inlineData?.data ?? '');      const buffer = convertToWav(audioParts, inlineData.mimeType ?? '');
      saveBinaryFile(fileName, buffer);
    }    if(part?.text) {
      console.log(part?.text);
    }
  }
}

function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`Appending stream content to file ${fileName}.`);
  });
}

interface WavConversionOptions {
  numChannels : number,
  sampleRate: number,
  bitsPerSample: number
}

function convertToWav(rawData: string[], mimeType: string) {
  const options = parseMimeType(mimeType);
  const dataLength = rawData.reduce((a, b) => a + b.length, 0);
  const wavHeader = createWavHeader(dataLength, options);
  const buffer = Buffer.concat(rawData.map(data => Buffer.from(data, 'base64')));  return Buffer.concat([wavHeader, buffer]);
}

function parseMimeType(mimeType : string) {
  const [fileType, ...params] = mimeType.split(';').map(s => s.trim());
  const [_, format] = fileType.split('/');  const options : Partial<WavConversionOptions> = {
    numChannels: 1,
    bitsPerSample: 16,
  };  if (format && format.startsWith('L')) {
    const bits = parseInt(format.slice(1), 10);
    if (!isNaN(bits)) {
      options.bitsPerSample = bits;
    }
  }  for (const param of params) {
    const [key, value] = param.split('=').map(s => s.trim());
    if (key === 'rate') {
      options.sampleRate = parseInt(value, 10);
    }
  }  return options as WavConversionOptions;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
  const {
    numChannels,
    sampleRate,
    bitsPerSample,
  } = options;  // http://soundfile.sapp.org/doc/WaveFormat

  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const buffer = Buffer.alloc(44);  buffer.write('RIFF', 0);                      // ChunkID
  buffer.writeUInt32LE(36 + dataLength, 4);     // ChunkSize
  buffer.write('WAVE', 8);                      // Format
  buffer.write('fmt ', 12);                     // Subchunk1ID
  buffer.writeUInt32LE(16, 16);                 // Subchunk1Size (PCM)
  buffer.writeUInt16LE(1, 20);                  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);        // NumChannels
  buffer.writeUInt32LE(sampleRate, 24);         // SampleRate
  buffer.writeUInt32LE(byteRate, 28);           // ByteRate
  buffer.writeUInt16LE(blockAlign, 32);         // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34);      // BitsPerSample
  buffer.write('data', 36);                     // Subchunk2ID
  buffer.writeUInt32LE(dataLength, 40);         // Subchunk2Size

  return buffer;
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });  const model = 'models/gemini-2.0-flash-live-001'  const tools = [
    { googleSearch: {} },
  ];  const config = {
    responseModalities: [
        Modality.AUDIO,
    ],
    mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
    speechConfig: {
      languageCode: 'en-US',
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: 'Puck',
        }
      }
    },
    contextWindowCompression: {
        triggerTokens: '25600',
        slidingWindow: { targetTokens: '12800' },
    },
    tools,
  };  session = await ai.live.connect({
    model,
    callbacks: {
      onopen: function () {
        console.debug('Opened');
      },
      onmessage: function (message: LiveServerMessage) {
        responseQueue.push(message);
      },
      onerror: function (e: ErrorEvent) {
        console.debug('Error:', e.message);
      },
      onclose: function (e: CloseEvent) {
        console.debug('Close:', e.reason);
      },
    },
    config
  });  session.sendClientContent({
    turns: [
      `INSERT_INPUT_HERE`
    ]
  });  await handleTurn();  session.close();
}main();<!--  -->
<!--  -->
<!--  -->
// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node
import {
  GoogleGenAI,
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
} from '@google/genai';
import mime from 'mime';
import { writeFile } from 'fs';
const responseQueue: LiveServerMessage[] = [];
let session: Session | undefined = undefined;

async function handleTurn(): Promise<LiveServerMessage[]> {
  const turn: LiveServerMessage[] = [];
  let done = false;
  while (!done) {
    const message = await waitMessage();
    turn.push(message);
    if (message.serverContent && message.serverContent.turnComplete) {
      done = true;
    }
  }
  return turn;
}

async function waitMessage(): Promise<LiveServerMessage> {
  let done = false;
  let message: LiveServerMessage | undefined = undefined;
  while (!done) {
    message = responseQueue.shift();
    if (message) {
      handleModelTurn(message);
      done = true;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  return message!;
}

const audioParts: string[] = [];
function handleModelTurn(message: LiveServerMessage) {
  if(message.serverContent?.modelTurn?.parts) {
    const part = message.serverContent?.modelTurn?.parts?.[0];    if(part?.fileData) {
      console.log(`File: ${part?.fileData.fileUri}`);
    }    if (part?.inlineData) {
      const fileName = 'audio.wav';
      const inlineData = part?.inlineData;      audioParts.push(inlineData?.data ?? '');      const buffer = convertToWav(audioParts, inlineData.mimeType ?? '');
      saveBinaryFile(fileName, buffer);
    }    if(part?.text) {
      console.log(part?.text);
    }
  }
}

function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`Appending stream content to file ${fileName}.`);
  });
}

interface WavConversionOptions {
  numChannels : number,
  sampleRate: number,
  bitsPerSample: number
}

function convertToWav(rawData: string[], mimeType: string) {
  const options = parseMimeType(mimeType);
  const dataLength = rawData.reduce((a, b) => a + b.length, 0);
  const wavHeader = createWavHeader(dataLength, options);
  const buffer = Buffer.concat(rawData.map(data => Buffer.from(data, 'base64')));  return Buffer.concat([wavHeader, buffer]);
}

function parseMimeType(mimeType : string) {
  const [fileType, ...params] = mimeType.split(';').map(s => s.trim());
  const [_, format] = fileType.split('/');  const options : Partial<WavConversionOptions> = {
    numChannels: 1,
    bitsPerSample: 16,
  };  if (format && format.startsWith('L')) {
    const bits = parseInt(format.slice(1), 10);
    if (!isNaN(bits)) {
      options.bitsPerSample = bits;
    }
  }  for (const param of params) {
    const [key, value] = param.split('=').map(s => s.trim());
    if (key === 'rate') {
      options.sampleRate = parseInt(value, 10);
    }
  }  return options as WavConversionOptions;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
  const {
    numChannels,
    sampleRate,
    bitsPerSample,
  } = options;  // http://soundfile.sapp.org/doc/WaveFormat

  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const buffer = Buffer.alloc(44);  buffer.write('RIFF', 0);                      // ChunkID
  buffer.writeUInt32LE(36 + dataLength, 4);     // ChunkSize
  buffer.write('WAVE', 8);                      // Format
  buffer.write('fmt ', 12);                     // Subchunk1ID
  buffer.writeUInt32LE(16, 16);                 // Subchunk1Size (PCM)
  buffer.writeUInt16LE(1, 20);                  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);        // NumChannels
  buffer.writeUInt32LE(sampleRate, 24);         // SampleRate
  buffer.writeUInt32LE(byteRate, 28);           // ByteRate
  buffer.writeUInt16LE(blockAlign, 32);         // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34);      // BitsPerSample
  buffer.write('data', 36);                     // Subchunk2ID
  buffer.writeUInt32LE(dataLength, 40);         // Subchunk2Size

  return buffer;
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });  const model = 'models/gemini-2.5-flash-exp-native-audio-thinking-dialog'  const config = {
    responseModalities: [
        Modality.AUDIO,
    ],
    mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: 'Zephyr',
        }
      }
    },
    contextWindowCompression: {
        triggerTokens: '25600',
        slidingWindow: { targetTokens: '12800' },
    },
  };  session = await ai.live.connect({
    model,
    callbacks: {
      onopen: function () {
        console.debug('Opened');
      },
      onmessage: function (message: LiveServerMessage) {
        responseQueue.push(message);
      },
      onerror: function (e: ErrorEvent) {
        console.debug('Error:', e.message);
      },
      onclose: function (e: CloseEvent) {
        console.debug('Close:', e.reason);
      },
    },
    config
  });  session.sendClientContent({
    turns: [
      `INSERT_INPUT_HERE`
    ]
  });  await handleTurn();  session.close();
}main();<!--  -->
<!--  -->
<!--  -->// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node
import {
  GoogleGenAI,
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
} from '@google/genai';
import mime from 'mime';
import { writeFile } from 'fs';
const responseQueue: LiveServerMessage[] = [];
let session: Session | undefined = undefined;

async function handleTurn(): Promise<LiveServerMessage[]> {
  const turn: LiveServerMessage[] = [];
  let done = false;
  while (!done) {
    const message = await waitMessage();
    turn.push(message);
    if (message.serverContent && message.serverContent.turnComplete) {
      done = true;
    }
  }
  return turn;
}

async function waitMessage(): Promise<LiveServerMessage> {
  let done = false;
  let message: LiveServerMessage | undefined = undefined;
  while (!done) {
    message = responseQueue.shift();
    if (message) {
      handleModelTurn(message);
      done = true;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  return message!;
}

const audioParts: string[] = [];
function handleModelTurn(message: LiveServerMessage) {
  if(message.serverContent?.modelTurn?.parts) {
    const part = message.serverContent?.modelTurn?.parts?.[0];    if(part?.fileData) {
      console.log(`File: ${part?.fileData.fileUri}`);
    }    if (part?.inlineData) {
      const fileName = 'audio.wav';
      const inlineData = part?.inlineData;      audioParts.push(inlineData?.data ?? '');      const buffer = convertToWav(audioParts, inlineData.mimeType ?? '');
      saveBinaryFile(fileName, buffer);
    }    if(part?.text) {
      console.log(part?.text);
    }
  }
}

function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`Appending stream content to file ${fileName}.`);
  });
}

interface WavConversionOptions {
  numChannels : number,
  sampleRate: number,
  bitsPerSample: number
}

function convertToWav(rawData: string[], mimeType: string) {
  const options = parseMimeType(mimeType);
  const dataLength = rawData.reduce((a, b) => a + b.length, 0);
  const wavHeader = createWavHeader(dataLength, options);
  const buffer = Buffer.concat(rawData.map(data => Buffer.from(data, 'base64')));  return Buffer.concat([wavHeader, buffer]);
}

function parseMimeType(mimeType : string) {
  const [fileType, ...params] = mimeType.split(';').map(s => s.trim());
  const [_, format] = fileType.split('/');  const options : Partial<WavConversionOptions> = {
    numChannels: 1,
    bitsPerSample: 16,
  };  if (format && format.startsWith('L')) {
    const bits = parseInt(format.slice(1), 10);
    if (!isNaN(bits)) {
      options.bitsPerSample = bits;
    }
  }  for (const param of params) {
    const [key, value] = param.split('=').map(s => s.trim());
    if (key === 'rate') {
      options.sampleRate = parseInt(value, 10);
    }
  }  return options as WavConversionOptions;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
  const {
    numChannels,
    sampleRate,
    bitsPerSample,
  } = options;  // http://soundfile.sapp.org/doc/WaveFormat

  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const buffer = Buffer.alloc(44);  buffer.write('RIFF', 0);                      // ChunkID
  buffer.writeUInt32LE(36 + dataLength, 4);     // ChunkSize
  buffer.write('WAVE', 8);                      // Format
  buffer.write('fmt ', 12);                     // Subchunk1ID
  buffer.writeUInt32LE(16, 16);                 // Subchunk1Size (PCM)
  buffer.writeUInt16LE(1, 20);                  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);        // NumChannels
  buffer.writeUInt32LE(sampleRate, 24);         // SampleRate
  buffer.writeUInt32LE(byteRate, 28);           // ByteRate
  buffer.writeUInt16LE(blockAlign, 32);         // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34);      // BitsPerSample
  buffer.write('data', 36);                     // Subchunk2ID
  buffer.writeUInt32LE(dataLength, 40);         // Subchunk2Size

  return buffer;
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });  const model = 'models/gemini-2.5-flash-preview-native-audio-dialog'  const config = {
    responseModalities: [
        Modality.AUDIO,
    ],
    mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: 'Zephyr',
        }
      }
    },
    contextWindowCompression: {
        triggerTokens: '25600',
        slidingWindow: { targetTokens: '12800' },
    },
  };  session = await ai.live.connect({
    model,
    callbacks: {
      onopen: function () {
        console.debug('Opened');
      },
      onmessage: function (message: LiveServerMessage) {
        responseQueue.push(message);
      },
      onerror: function (e: ErrorEvent) {
        console.debug('Error:', e.message);
      },
      onclose: function (e: CloseEvent) {
        console.debug('Close:', e.reason);
      },
    },
    config
  });  session.sendClientContent({
    turns: [
      `INSERT_INPUT_HERE`
    ]
  });  await handleTurn();  session.close();
}main();<!--  -->
<!--  -->
<!--  -->// To run this code you need to install the following dependencies:
// npm install @google/genai
// npm install -D @types/node

import {
  GoogleGenAI
} from '@google/genai';
import { writeFile } from 'fs';

function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });  const response = await ai.models.generateImages({
    model: 'models/imagen-3.0-generate-002',
    prompt: `INSERT_INPUT_HERE`,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '1:1',
    },
  });  if (!response?.generatedImages) {
    console.error('No images generated.');
    return;
  }  if (response.generatedImages.length !== 1) {
    console.error('Number of images generated does not match the requested number.');
  }  for (let i = 0; i < response.generatedImages.length; i++) {
    if (!response.generatedImages?.[i]?.image?.imageBytes) {
      continue;
    }
    const fileName = `image_${i}.jpeg`;
    const inlineData = response?.generatedImages?.[i]?.image?.imageBytes;
    const buffer = Buffer.from(inlineData || '', 'base64');
    saveBinaryFile(fileName, buffer);
  }
}
main();<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->// To run this code you need to install the following dependencies:
// npm install @google/genai
// npm install -D @types/node

import {
  GoogleGenAI
} from '@google/genai';

import {writeFile} from 'fs/promises';
import fetch from 'node-fetch';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });  let operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt: `INSERT_INPUT_HERE`,
    config: {
        numberOfVideos: 1,
        aspectRatio: '16:9',
        personGeneration: 'dont_allow',
        durationSeconds: 8,
    },
  });  while (!operation.done) {
    console.log(`Video ${operation.name} has not been generated yet. Check again in 10 seconds...`);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({
      operation: operation,
    });
  }  console.log(`Generated ${operation.response?.generatedVideos?.length ?? 0} video(s).`);  operation.response?.generatedVideos?.forEach(async (generatedVideo, i) => {
    console.log(`Video has been generated: ${generatedVideo?.video?.uri}`);
    const response = await fetch(`${generatedVideo?.video?.uri}&key=${process.env.GEMINI_API_KEY}`);
    const buffer = await response.arrayBuffer();
    await writeFile(`video_${i}.mp4`, Buffer.from(buffer));
    console.log(`Video ${generatedVideo?.video?.uri} has been downloaded to video_${i}.mp4.`);
  });
}
main();<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
import mime from 'mime';
import { writeFile } from 'fs';

function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    temperature: 1,
    responseModalities: [
        'audio',
    ],
    speechConfig: {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: [
          {
            speaker: 'Speaker 1',
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Zephyr'
              }
            }
          },
          {
            speaker: 'Speaker 2',
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Puck'
              }
            }
          },
        ]
      },
    },
  };
  const model = 'gemini-2.5-flash-preview-tts';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Please read aloud the following:
Speaker 1: Hey Assistant, how tall is the Empire State Building? Good, what is up? My man
Speaker 2: The Empire State Building is 1,454 feet, or about 443 meters tall.`,
        },
      ],
    },
  ];  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
      continue;
    }
    if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const fileName = `ENTER_FILE_NAME_${fileIndex++}`;
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      let fileExtension = mime.getExtension(inlineData.mimeType || '');
      let buffer = Buffer.from(inlineData.data || '', 'base64');
      if (!fileExtension) {
        fileExtension = 'wav';
        buffer = convertToWav(inlineData.data || '', inlineData.mimeType || '');
      }
      saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
    }
    else {
      console.log(chunk.text);
    }
  }
}

main();

interface WavConversionOptions {
  numChannels : number,
  sampleRate: number,
  bitsPerSample: number
}

function convertToWav(rawData: string, mimeType: string) {
  const options = parseMimeType(mimeType)
  const wavHeader = createWavHeader(rawData.length, options);
  const buffer = Buffer.from(rawData, 'base64');  return Buffer.concat([wavHeader, buffer]);
}

function parseMimeType(mimeType : string) {
  const [fileType, ...params] = mimeType.split(';').map(s => s.trim());
  const [_, format] = fileType.split('/');  const options : Partial<WavConversionOptions> = {
    numChannels: 1,
  };  if (format && format.startsWith('L')) {
    const bits = parseInt(format.slice(1), 10);
    if (!isNaN(bits)) {
      options.bitsPerSample = bits;
    }
  }  for (const param of params) {
    const [key, value] = param.split('=').map(s => s.trim());
    if (key === 'rate') {
      options.sampleRate = parseInt(value, 10);
    }
  }  return options as WavConversionOptions;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
  const {
    numChannels,
    sampleRate,
    bitsPerSample,
  } = options;  // http://soundfile.sapp.org/doc/WaveFormat

  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const buffer = Buffer.alloc(44);  buffer.write('RIFF', 0);                      // ChunkID
  buffer.writeUInt32LE(36 + dataLength, 4);     // ChunkSize
  buffer.write('WAVE', 8);                      // Format
  buffer.write('fmt ', 12);                     // Subchunk1ID
  buffer.writeUInt32LE(16, 16);                 // Subchunk1Size (PCM)
  buffer.writeUInt16LE(1, 20);                  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);        // NumChannels
  buffer.writeUInt32LE(sampleRate, 24);         // SampleRate
  buffer.writeUInt32LE(byteRate, 28);           // ByteRate
  buffer.writeUInt16LE(blockAlign, 32);         // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, 34);      // BitsPerSample
  buffer.write('data', 36);                     // Subchunk2ID
  buffer.writeUInt32LE(dataLength, 40);         // Subchunk2Size

  return buffer;
}
```
