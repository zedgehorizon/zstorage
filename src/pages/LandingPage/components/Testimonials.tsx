import { Star } from "lucide-react";
import React from "react";

interface Testimonial {
  userName: string;
  rating: number;
  occupation: string;
  avatar: string;
  companyLogo: string;
  feedback: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  function starRating(testimonialRating: number) {
    const fullStars = Array.from({ length: testimonialRating }, (_, index) => index + 1);
    const emptyStars = Array.from({ length: 5 - testimonialRating }, (_, index) => index + 1);
    return (
      <div>
        <span>
          {fullStars.map((star) => (
            <span className=" text-accent" key={star}>
              ★
            </span>
          ))}
        </span>
        <span>
          {emptyStars.map((star) => (
            <span key={star}>☆</span>
          ))}
        </span>
      </div>
    );
  }

  function testimonialCard(testimonial: Testimonial) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center">
        {starRating(testimonial.rating)}
        <span className="text-foreground/50">{testimonial.feedback}</span>
        <div className="flex flex-row gap-3  items-center justify-center">
          <img src={testimonial.avatar} className="rounded-full w-8 h-8"></img>
          <div className="flex flex-col border-r-2 border-foreground px-4">
            <p className="text-accent">{testimonial.userName}</p> <p> {testimonial.occupation}</p>
          </div>

          <img src={testimonial.companyLogo} className="rounded-full h-8 max-w-24"></img>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <span className="text-4xl">Testimonials</span>
      {testimonials.map((testimonial) => {
        return testimonialCard(testimonial);
      })}
    </div>
  );
};

export default Testimonials;
