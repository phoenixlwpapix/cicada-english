import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWindowSize } from "@uidotdev/usehooks";
import { BookOpen, Image as ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";

export default function StoryCard({
  loading,
  story,
  user,
  imageLoading,
  imageError,
  generatedImage,
  storyRef,
}) {
  const { width } = useWindowSize();
  const router = useRouter();

  // Story Header Component
  const StoryHeader = ({ hoverEffect = false }) => (
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
        <p className="text-sm text-muted-foreground">
          {loading ? "AI正在生成故事，请稍候..." : "仔细阅读下面的故事"}
        </p>
      </div>
    </div>
  );

  // Story Content Component
  const StoryContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
          <span className="text-muted-foreground">
            AI创作中，精彩马上呈现...
          </span>
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

  // Image Display Component
  const ImageDisplay = () => (
    <div
      className={`bg-muted rounded-xl ${
        width < 640
          ? "px-2 border border-border/50"
          : "p-6 border border-border/50"
      }`}
    >
      <h3 className="text-lg font-semibold text-card-foreground mb-3 flex items-center gap-2">
        <ImageIcon className="w-5 h-5" />
        AI配图
      </h3>

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
      ) : generatedImage ? (
        <div className="space-y-3">
          <div className="p-1 sm:p-4 mx-auto max-w-[80vw] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[896px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={generatedImage}
              alt="AI生成的故事配图"
              className="w-full h-auto object-contain rounded-md"
              loading="lazy"
              decoding="async"
              style={{ aspectRatio: "1280/896" }}
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
      <div className="px-2 py-4 space-y-4">
        <StoryHeader />
        <div className="space-y-6">
          <div className="text-lg bg-muted text-primary rounded-xl px-2 border border-border/50">
            <StoryContent />
          </div>
          <ImageDisplay />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
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
  );
}
