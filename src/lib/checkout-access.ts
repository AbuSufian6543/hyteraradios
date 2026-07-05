import { cookies } from "next/headers";
import { auth } from "./auth";

export const PENDING_CHECKOUT_ORDER_COOKIE = "pending_checkout_order";

const CHECKOUT_COOKIE_MAX_AGE = 60 * 60 * 2; // 2 hours

type CheckoutOrder = {
  id: string;
  userId: string | null;
};

/** Bind a pending order to the current browser session (guest checkout). */
export async function stampPendingCheckoutOrder(orderId: string) {
  const cookieStore = await cookies();
  cookieStore.set(PENDING_CHECKOUT_ORDER_COOKIE, orderId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: CHECKOUT_COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearPendingCheckoutOrder() {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_CHECKOUT_ORDER_COOKIE);
}

/**
 * Ensures the caller may complete or cancel a checkout order.
 * Logged-in users must own the order; guests must hold the pending-order cookie.
 */
export async function assertCheckoutOrderAccess(
  order: CheckoutOrder,
): Promise<{ error: string } | null> {
  const session = await auth();

  if (order.userId) {
    if (session?.user?.id !== order.userId) {
      return { error: "Invalid order." };
    }
    return null;
  }

  const cookieStore = await cookies();
  const pendingId = cookieStore.get(PENDING_CHECKOUT_ORDER_COOKIE)?.value;
  if (!pendingId || pendingId !== order.id) {
    return { error: "Invalid order." };
  }

  return null;
}
