import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  BookOpen,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Play,
  Pause,
  Volume2,
  X as CloseIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, forwardRef } from "react";

const StoryCard = forwardRef(function StoryCard(
  {
    loading,
    story,
    user,
    imageLoading,
    imageError,
    generatedImage,
    storyRef,
    onQuizStart,
  },
  ref
) {
  const { width } = useWindowSize();
  const router = useRouter();
  const [showImage, setShowImage] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Speech synthesis states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const speechRef = useRef(null);
  const utteranceRef = useRef(null);

  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Clean up speech synthesis when component unmounts or story changes
  useEffect(() => {
    // Stop any ongoing speech when story changes or component unmounts
    stopSpeaking();

    return () => {
      if (speechRef.current) {
        speechRef.current.cancel();
      }
    };
  }, [story]);

  // Reset showImage to true when a new image is generated
  useEffect(() => {
    if (generatedImage) {
      setShowImage(true);
    }
  }, [generatedImage]);

  // Expose stopSpeaking function to parent component
  useEffect(() => {
    if (onQuizStart) {
      onQuizStart(stopSpeaking);
    }
  }, [onQuizStart]);

  // Clean up markdown content for speech synthesis
  const cleanMarkdownForSpeech = (text) => {
    if (!text) return "";

    return (
      text
        // Remove markdown headers (# ## ### etc.)
        .replace(/^#{1,6}\s+/gm, "")
        // Remove bold/italic markers (** * __ _)
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/_(.*?)_/g, "$1")
        // Remove links [text](url) -> keep only text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        // Remove inline code `code`
        .replace(/`([^`]+)`/g, "$1")
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, "")
        // Remove image markdown ![alt](url)
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
        // Remove blockquotes >
        .replace(/^>\s+/gm, "")
        // Remove lists markers (1. 2. 3. and - * +)
        .replace(/^\d+\.\s+/gm, "")
        .replace(/^[-*+]\s+/gm, "")
        // Remove horizontal rules
        .replace(/^---+$/gm, "")
        // Remove extra line breaks but keep paragraph breaks
        .replace(/\n{3,}/g, "\n\n")
        // Remove any remaining markdown syntax patterns
        .replace(/[#*`_~\[\]()]/g, "")
        .trim()
    );
  };

  // Initialize speech synthesis with US accent
  const initializeSpeech = () => {
    if (!speechSupported) return null;

    // Cancel any ongoing speech
    if (speechRef.current) {
      speechRef.current.cancel();
    }

    // Clean the story content for speech
    const cleanStory = cleanMarkdownForSpeech(story);

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(cleanStory);

    // Find US English voice
    const voices = speechSynthesis.getVoices();
    const usVoice = voices.find(
      (voice) =>
        voice.lang.includes("en-US") ||
        voice.name.includes("English (United States)")
    );

    if (usVoice) {
      utterance.voice = usVoice;
    } else {
      // Fallback to any English voice
      const englishVoice = voices.find((voice) => voice.lang.includes("en"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }

    // Set speech parameters
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Set up event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechRef.current = window.speechSynthesis;

    return utterance;
  };

  // Initialize speech synthesis when component mounts
  useEffect(() => {
    // Set up speech synthesis reference
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechRef.current = window.speechSynthesis;
    }
  }, []);

  // Handle play/pause functionality
  const handlePlayPause = () => {
    if (!speechSupported || !story) return;

    if (!isSpeaking) {
      // Start speaking - create new utterance only when starting fresh
      const utterance = initializeSpeech();
      if (utterance) {
        speechRef.current.speak(utterance);
      }
    } else if (isPaused) {
      // Resume speaking - use existing speech synthesis
      if (speechRef.current) {
        speechRef.current.resume();
        // Update state immediately for better UX
        setIsPaused(false);
      }
    } else {
      // Pause speaking
      if (speechRef.current) {
        speechRef.current.pause();
        // Update state immediately with a short delay to ensure the pause is registered
        setTimeout(() => {
          setIsPaused(true);
        }, 100);
      }
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (speechRef.current) {
      speechRef.current.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Story Header Component
  const StoryHeader = ({ hoverEffect = false }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`p-3 rounded-xl bg-secondary text-primary-foreground shadow-lg transition-transform duration-300 ${
            hoverEffect ? "group-hover:scale-110" : ""
          }`}
        >
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-card-foreground">阅读文章</h2>
          <div className="text-sm text-muted-foreground flex items-center">
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            )}
            {loading ? "AI正在生成故事，请稍候..." : "仔细阅读下面的故事"}
          </div>
        </div>
      </div>

      {/* Text-to-Speech Button */}
      {!loading && story && speechSupported && (
        <Button
          onClick={handlePlayPause}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-muted/50 hover:bg-muted transition-colors"
          aria-label={
            isPaused ? "继续朗读" : isSpeaking ? "暂停朗读" : "开始朗读"
          }
        >
          {isSpeaking ? (
            isPaused ? (
              <>
                <Play className="w-4 h-4" />
                <span className="text-sm">继续</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                <span className="text-sm">暂停</span>
              </>
            )
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span className="text-sm">朗读</span>
            </>
          )}
        </Button>
      )}
    </div>
  );

  // Story Content Component
  const StoryContent = () => {
    if (loading) {
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="h-6 bg-border rounded-md animate-pulse"></div>
            <div className="h-4 bg-border rounded-md animate-pulse w-3/4"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-border rounded-md animate-pulse"></div>
            <div className="h-4 bg-border rounded-md animate-pulse"></div>
            <div className="h-4 bg-border rounded-md animate-pulse w-5/6"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-border rounded-md animate-pulse"></div>
            <div className="h-4 bg-border rounded-md animate-pulse w-1/2"></div>
          </div>
        </div>
      );
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => <p className="mt-4" {...props} />,
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold mt-5 mb-3" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="ml-6 list-disc" {...props} />
          ),
        }}
      >
        {story}
      </ReactMarkdown>
    );
  };

  // Image Preview Modal Component
  const ImagePreviewModal = () => (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setIsPreviewOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview"
    >
      <div
        className="relative max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={generatedImage}
          alt="Generated ad preview"
          className="object-contain w-auto h-auto max-w-full max-h-[90vh] rounded-lg shadow-2xl"
        />
        <button
          onClick={() => setIsPreviewOpen(false)}
          className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-full p-1 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          aria-label="Close preview"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );

  // Image Display Component
  const ImageDisplay = () => (
    <div
      className={`bg-muted rounded-xl ${
        width < 640
          ? "px-2 border border-border/50"
          : "p-6 border border-border/50"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          AI配图
        </h3>
        {generatedImage && (
          <button
            onClick={() => setShowImage(!showImage)}
            className="p-2 rounded-md hover:bg-muted-foreground/10 transition-colors"
            aria-label={showImage ? "隐藏图片" : "显示图片"}
          >
            {showImage ? (
              <EyeOff className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Eye className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        )}
      </div>

      {!user ? (
        <div className="text-center py-8">
          <div className="text-amber-500 mb-3">🔒</div>
          <p className="text-amber-700 dark:text-amber-300 font-medium mb-2">
            登录后解锁AI配图功能
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            登录用户可以查看AI生成的精美配图，并挑战排行榜！
          </p>
          <Button onClick={() => router.push("/login")} className="font-medium">
            立即登录
          </Button>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <p className="text-primary dark:text-blue-300 font-medium mb-2">
            AI配图将在文章生成后启动
          </p>
          <p className="text-sm text-muted-foreground">
            请耐心等待文章生成完成...
          </p>
        </div>
      ) : imageLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
          <span className="text-muted-foreground">
            AI正在生成配图，请稍候...
          </span>
        </div>
      ) : imageError ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">❌</div>
          <p className="text-red-600 dark:text-red-400 text-sm">{imageError}</p>
        </div>
      ) : generatedImage && showImage ? (
        <div className="space-y-3">
          <div className="p-1 sm:p-4 mx-auto max-w-[80vw] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[896px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={generatedImage}
              alt="AI生成的故事配图"
              className="w-full h-auto object-contain rounded-md cursor-pointer"
              loading="lazy"
              decoding="async"
              style={{ aspectRatio: "1280/896" }}
              onClick={() => setIsPreviewOpen(true)}
              onLoad={(e) =>
                console.log(
                  "Image dimensions:",
                  e.target.naturalWidth,
                  e.target.naturalHeight
                )
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );

  if (width < 640) {
    // Mobile layout
    return (
      <>
        {isPreviewOpen && <ImagePreviewModal />}
        <div className="px-2 py-4 space-y-4">
          <StoryHeader />
          <div className="space-y-6">
            <div className="text-lg bg-muted text-primary rounded-xl px-2 border border-border/50">
              <StoryContent />
            </div>
            <ImageDisplay />
          </div>
        </div>
      </>
    );
  }

  // Desktop layout
  return (
    <>
      {isPreviewOpen && <ImagePreviewModal />}
      <Card
        ref={storyRef}
        className="backdrop-blur-lg bg-card/70 border-border shadow-xl hover:shadow-2xl transition-all duration-300 group animate-fade-in-up"
      >
        <CardContent className="space-y-4">
          <StoryHeader hoverEffect={true} />
          <div className="space-y-6">
            <div className="text-lg bg-muted text-primary rounded-xl p-6 border border-border/50">
              <StoryContent />
            </div>
            <ImageDisplay />
          </div>
        </CardContent>
      </Card>
    </>
  );
});

StoryCard.displayName = "StoryCard";

export default StoryCard;
