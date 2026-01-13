import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:3001";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const { id, documentId } = await params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_URL}/invoices/${id}/documents/${documentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { message: error.message || "Failed to delete document" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to delete document:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const { id, documentId } = await params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${API_URL}/invoices/${id}/documents/${documentId}/download`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to download document" },
        { status: res.status }
      );
    }

    // Stream the file back to the client
    const blob = await res.blob();
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = res.headers.get("content-disposition") || "";

    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("Failed to download document:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
