import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { avatarUrl } = await request.json();

    if (!avatarUrl) {
      return NextResponse.json({ error: "Missing avatarUrl" }, { status: 400 });
    }

    // Upsert the user's avatar in the profiles table
    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, avatar_url: avatarUrl }, { onConflict: "id" })
      .select();

    if (error) {
      console.error("Error updating avatar:", error);
      return NextResponse.json(
        { error: `Failed to update avatar: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Avatar update error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's avatar from the profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id);

    if (error) {
      console.error("Error fetching avatar:", error);
      return NextResponse.json(
        { error: `Failed to fetch avatar: ${error.message}` },
        { status: 500 }
      );
    }

    // If no profile exists or no avatar is set, return the default
    const avatarUrl =
      data && data.length > 0
        ? data[0].avatar_url || "/avatars/monkey.png"
        : "/avatars/monkey.png";

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error("Avatar fetch error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
