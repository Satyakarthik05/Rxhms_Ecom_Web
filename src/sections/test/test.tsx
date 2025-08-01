"use client";

import { useEffect, useState } from "react";
import { useFetchByQuery } from "../../customHooks/hooks";
import type { MenuGroup, MenuResponse } from "./model/textModel";
import { usePostByBody } from "../../customHooks/usePostByBody";
import { CutomerCreateURI, uri } from "./service.ts/testServiceConstants";

export const Test = () => {
  const { data, isLoading, error } = useFetchByQuery<MenuResponse>(uri, {
    channelId: 1,
  });
  const [postResponse, setPostResponse] = useState<any>(null);

  const {
    data: postData,
    loading: postLoading,
    error: postError,
    executePost,
  } = usePostByBody<any>();

  const handlePostRequest = () => {
    executePost(CutomerCreateURI, {
      firstName: "din",
      middleName: "esh",
      lastName: "mattigunta",
      gender: "MALE",
      dob: "1999-10-31",
      anniversary: 0,
      mobileIsd: "+91",
      mobileNumber: "7878235431",
      emailId: "amit.din@chssoftware.com",
      referredBy: null,
      prefLang: "EN",
      registeredOn: "2023-09-09T10:29:00",
      currency: "INR",
    });
  };

  useEffect(() => {
    if (postData) {
      setPostResponse(postData);
    }
  }, [postData]);

  console.log("postResponse", postResponse);

  const menuGroups = data?.content?.menuGroups || null;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      {menuGroups !== null && menuGroups.length > 0 ? (
        menuGroups.map((each: MenuGroup, index: number) => (
          <span key={index}>
            {each.title} <br />
          </span>
        ))
      ) : (
        <span>No menu groups available</span>
      )}

      <button
        className="btn btn-primary"
        // onClick={handlePostRequest}
        disabled={postLoading}
      >
        {postLoading ? "Posting..." : "Post"}
      </button>

      {postError && <div>Error: {postError.message}</div>}
      {postResponse && (
        <div>Success! Response: {JSON.stringify(postResponse)}</div>
      )}
    </div>
  );
};
