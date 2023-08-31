import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useActionData
} from "@remix-run/react";
import { useState ,useRef,useEffect} from "react";
import invariant from "tiny-invariant";

import { deleteNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { updateNote } from "../models/note.server";

export const loader = async ({ params, request }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");
  const note = await getNote({ id: params.noteId, userId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
};

export const action = async ({ params, request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const method = formData.get("action")
  const title = formData.get("title")
  const body = formData.get("body")
  invariant(params.noteId, "noteId not found");
  let url = params.noteId
  console.log("url",url);
  if(method == 'update'){
    await updateNote({ body,title ,url });
    return redirect("/notes/"+url)
  }
  else{
    await deleteNote({ id: params.noteId, userId });
    return redirect("/notes");
  }
};

export default function NoteDetailsPage() {
  const data = useLoaderData();

  const [methods,setMethod] = useState();
  const [title,setTitle] = useState(data.note.title);
  const [content,setContent] = useState(data.note.body);

  const actionData = useActionData();
  const titleRef = useRef(null);
  const bodyRef = useRef(null);

  console.log("bttn clk",methods);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);
  useEffect(()=>{
    setTitle(data.note.title);
    setContent(data.note.body);
  },[methods])

  

  return (
    <div>
      <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
        <input
            ref={titleRef}
            name="title"
            value={title}
           onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />

      <textarea
            ref={bodyRef}
            name="body"
            value={content}
            rows={8}
            onChange={(e) => setContent(e.target.value)}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? "body-error" : undefined
            }
          />      <hr className="my-4" />
      {/* <Form method="post"> */}
        <button
          type="submit"
          value="delete"
          name="action"
          id="delete"
          onClick={e => setMethod(e.target.id)}
          className="p-2 rounded bg-blue-500  text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>

        <button
          type="submit"
          value="update"
          name="action"
          id="update"
          onClick={e => setMethod(e.target.id)}
          className="p-2 rounded bg-blue-500  text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Update
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
