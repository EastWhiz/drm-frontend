"use client";

import { useRef } from "react";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./feedback-swiper.css";

interface Comment {
  comment: string;
  date?: string;
  author?: string;
  type: "positive" | "negative";
}

interface FeedbackProps {
  positiveComments?: {
    first?: { comment: string; date?: string; author?: string };
    second?: { comment: string; date?: string; author?: string };
  };
  negativeComment?: { comment: string; date?: string; author?: string };
  rating: number;
}

const Feedback = ({
  positiveComments,
  negativeComment,
  rating,
}: FeedbackProps) => {
  const processComments = () => {
    const comments: Comment[] = [];
    if (positiveComments?.first)
      comments.push({ ...positiveComments.first, type: "positive" });
    if (positiveComments?.second)
      comments.push({ ...positiveComments.second, type: "positive" });
    if (negativeComment)
      comments.push({ ...negativeComment, type: "negative" });
    return comments;
  };

  const comments = processComments();

  const getAvatarColor = (type: "positive" | "negative") =>
    type === "positive"
      ? "bg-[#ADD8FF] border-[#ADD8FF] text-white"
      : "bg-[#FF7664] border-[#FF7664] text-white";

  const getCardBgColor = (type: "positive" | "negative") =>
    type === "positive"
      ? "border border-[#ADD8FF]"
      : "bg-[#FFF2F2] border border-[#FFCCCC]";

  const renderStars = (type: "positive" | "negative") => {
    const stars = type === "positive" ? 5 : 1;
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
        />
      ));
  };

  if (comments.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No feedback available
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">Patient Feedback</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        // navigation
        pagination
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
          1280: { slidesPerView: 2 },
        }}
        className="w-full"
      >
        {comments.map((comment, index) => (
          <SwiperSlide key={index}>
            <div
              className={`rounded-lg p-4 h-full ${getCardBgColor(
                comment.type
              )}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-16 h-16 border ${getAvatarColor(
                    comment.type
                  )} font-medium rounded-full`}
                >
                  <span className="text-2xl">
                    {comment.author?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-black dark:text-white">
                      {comment.author || "Anonymous"}
                    </h3>
                    <div className="flex">{renderStars(comment.type)}</div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {comment.comment}
                  </p>
                  {comment.date && (
                    <p className="text-xs text-gray-500 mt-2">{comment.date}</p>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Feedback;
