import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import TextPressure from './TextPressure';

export default function FeaturesSection() {
  return (

<>



<TextPressure 
sentence="Why We’re More Than Just Books"
manualMode={false}
blurAmount={1.6}
borderColor="indigo"
animationDuration={1}
pauseBetweenAnimations={1}
/>
<div style={{position: 'relative', height: '50px'}}>
</div>
    <InfiniteMovingCards
      items={[
        { quote: "Curated for Quality", name: "Over 120 handpicked PDF books — carefully selected to ensure depth, clarity, and life-changing value in under 150 pages.", title: "" },
        { quote: "Elegant Design That Feels Premium", name: "Every book is thoughtfully formatted with clean layouts, spacious margins, and beautiful typography — crafted to offer a smooth, focused reading experience that feels truly refined.", title: "" },
        {
          quote: "Instant Access, Forever Yours",
          name: "No waiting. No subscriptions. Just one-click downloads — your book is yours for life, across any device.",
          title: "",
        },
        {
          quote: " Priced for Everyone, Built for Growth",
          name: "Books start from just $2, making powerful knowledge accessible to students, creators, and professionals alike.",
          title: "",
        },
      ]}
    />
    </>

  );
}
