import {Stripe, loadStripe} from "@stripe/stripe-js";

const getStripe = async () => {
  const resultStripe = await loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  if (!!resultStripe) {
    return resultStripe;
  } else {
    return null;
  }
};

export default getStripe;
