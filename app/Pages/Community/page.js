"use client"
import Navbar from '@/app/Components/Navbar'
import axios from 'axios';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

const Community = () => {
  const { data: session } = useSession();


  // ------------------------------fetching questions-------------------
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('http://localhost:8070/COMMUNITY-SERVICE/api/community/getAll');
      const data = await res.json();
      setQuestions(data);
    };

    fetchQuestions();
  }, []);

  // ----------------posting question------------------------------
  const [formData, setFormData] = useState({
    username: 'unknown',
    message: '',
    profileimageurl: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Post data to the Spring Boot microservice
      const response = await axios.post(
        `http://localhost:8070/COMMUNITY-SERVICE/api/community/setQuestion`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response:', response.data);
      alert('question posted successfully!');
    } catch (error) {
      console.error('Error posting data:', error);
      alert('Error posting question. Please try again.');
    }
  };

  //---------------------getting session username
  useEffect(() => {
    // Simulate session fetch
    // Replace with actual session logic
    if (session) {
      setFormData((prev) => ({
        ...prev,
        username: session?.user.name,
        profileimageurl: session?.user.image
      }));
    }
  }, []);


  //--------------------showing date in the form of Feb 12-2022
  const formatDate = (date) => {
    if (!date) return "";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };


  //--------------------------------posting reply buttn 

  const [replyTo, setReplyTo] = useState(null); // Track the username for reply
  const [replyMessage, setReplyMessage] = useState(""); // Separate state for reply message
  const [referredCommentId, setReferredCommentId] = useState(null); // For commentId

  //--------------------------------after clicking reply button of any question

  const handleReplyClick = (username, commentId) => {
    setReplyTo(username); // Store username of the comment being replied to
    setReferredCommentId(commentId); // Store the commentId of the comment being replied to
    setReplyMessage(`@${username}\t `); // Prefill reply textarea
  };

  const handleTextareaChange = (e) => {
    setReplyMessage(e.target.value); // Update the reply message
  };



  // ------------------------posting reply--------------------------------------------

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    console.log("Reply submitted to:", replyTo);
    console.log("Reply message:", replyMessage);

    if (!replyTo || !replyMessage.trim() || !referredCommentId) {
      console.error("Reply details are incomplete!");
      return;
    }

    
    const username = session?.user?.name ?? 'unknown';

    const profileimageurl = session?.user?.image ?? null;




    // ----------------------Prepare the payload for the API
    const payload = {
      username: username, // The username of the replier
      profileimageurl: profileimageurl,//profile image
      refferdcommentid: referredCommentId, // The ID of the comment being replied to
      message: replyMessage.trim(), // The reply message
    };

    try {
      // API call to post the reply
      const response = await fetch("http://localhost:8070/COMMUNITY-SERVICE/api/community/setQuestionReply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Convert the payload to JSON
      });
      alert('reply posted successfully!');
      handleClose();
      if (!response.ok) {
        throw new Error("Failed to submit the reply.");
      }

      const data = await response.text();
      console.log("Reply submitted successfully:", data);

      // Optionally reset the form or update the UI
      setReplyTo(null);
      setReferredCommentId(null);
      setReplyMessage("");
    } catch (error) {
      console.error("Error submitting the reply:", error);
    }
  };

  const handleClose = () => {
    setReplyTo(null); // Reset reply target
    setReplyMessage(""); // Clear the textarea
  };

  //---------------------------------------------------


  //----------------------------fetching replies----------------------------------------------
  const [replies, setReplies] = useState([]); // Object to store replies for each question
  const [expandedQuestionId, setExpandedQuestionId] = useState(null); // Track which question's replies are being viewed

  const fetchReplies = (questionId) => {
    fetch(`http://localhost:8070/COMMUNITY-SERVICE/api/community/getReplyByRefCommentid/${questionId}`)
      .then((response) => response.json())
      .then((data) => {
        setReplies((prevReplies) => ({
          ...prevReplies,
          [questionId]: data, // Store replies for this question

        }));
        console.log("Fetched replies:", data);
        setExpandedQuestionId(questionId); // Mark this question as expanded
      })
      .catch((error) => console.error("Error fetching replies:", error));
  };


  // Function to convert plain text with URLs into clickable links
  const formatMessageWithLinks = (message) => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return message.split(urlRegex).reduce((acc, part, i, arr) => {
      if (i < arr.length - 1) {
        const match = message.match(urlRegex)[i];
        return [
          ...acc,
          part,
          <a
            key={match}
            href={match}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {match}
          </a>,
        ];
      }
      return [...acc, part];
    }, []);
  }
  //----------------------------------------------------


  return (
    <div>

      {/* community */}
      <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion (20)</h2>
          </div>

          {/* --------------send the community question--------------------------------- */}
          <form className="mb-6" onSubmit={handleSubmit} >
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <label for="comment" className="sr-only">Your comment</label>

              <textarea value={formData.message} onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))} id="comment" rows="6"
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."  ></textarea>
            </div>
            <button type="submit"
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
              Post comment
            </button>
          </form>





          {/* ----------------------question------------------------------ */}
          {questions.map((question) => (
            <>

              <article key={question.id} className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
                <footer className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                      className="mr-2 w-6 h-6 rounded-full"
                      src={question.profileimageurl}
                      alt="Michael Gough" /> {question.username}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-02-08"
                      title={question.date} >{formatDate(question.date)} </time></p>
                  </div>
                  <button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1"
                    className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    type="button">
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                      <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                    </svg>
                    <span className="sr-only">Comment settings</span>
                  </button>
                  {/* <!-- Dropdown menu --> */}
                  <div id="dropdownComment1"
                    className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownMenuIconHorizontalButton">
                      <li>
                        <a href="#"
                          className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                      </li>
                      <li>
                        <a href="#"
                          className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                      </li>
                      <li>
                        <a href="#"
                          className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                      </li>
                    </ul>
                  </div>
                </footer>

                {/* --------------------- comment data */}
                <p className="text-gray-500 dark:text-gray-400">{question.message}</p>
                <div className="flex items-center mt-4 space-x-4">
                  {/* -------------------reply btn */}
                  <button onClick={() => handleReplyClick(question.username, question.commentid)} type="button"
                    className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                    <svg className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                    </svg>
                    Reply
                  </button>
                  <button onClick={() => fetchReplies(question.commentid)} className="text-blue-500">
                    View Replies
                  </button>
                </div>
                <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
              </article>


              {/* ------------comment reply ----------------------------------- */}

              {/* Check if this question's replies are expanded */}
              {expandedQuestionId === question.commentid && (
                <div className="replies">
                  {replies[question.commentid] && replies[question.commentid].length > 0 ? (
                    replies[question.commentid].map((reply) => (

                      <article key={question.id} className="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
                        <footer className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                              className="mr-2 w-6 h-6 rounded-full"
                              src={reply.profileimageurl}
                              alt="Jese Leos" />{reply.username} </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-02-12"
                              title="February 12th, 2022">{formatDate(question.date)}</time></p>
                          </div>
                          <button id="dropdownComment2Button" data-dropdown-toggle="dropdownComment2"
                            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-40 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            type="button">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                            </svg>
                            <span className="sr-only">Comment settings</span>
                          </button>
                          {/* <!-- --------------------Dropdown menu ------------------> */}
                          <div id="dropdownComment2"
                            className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="dropdownMenuIconHorizontalButton">
                              <li>
                                <a href="#"
                                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                              </li>
                              <li>
                                <a href="#"
                                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                              </li>
                              <li>
                                <a href="#"
                                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                              </li>
                            </ul>
                          </div>
                        </footer>
                        <p className="text-gray-500 dark:text-gray-400">{formatMessageWithLinks(reply.message)} </p>
                        <div className="flex items-center mt-4 space-x-4">
                          <hr />
                        </div>
                        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                      </article>

                    ))
                  ) : (
                    <p>No replies found.</p>
                  )}
                </div>
              )}




              {/* --------------------------reply end------------------------------------------------ */}






            </>
          ))}

          {/* ------------------------question end-------------------------------------------------- */}


          {/* ---------------------------Reply Form Modal------------------------------------------ */}
          {replyTo && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold text-white mb-4">Write a Reply</h2>
                <form onSubmit={handleReplySubmit}>
                  <textarea
                    className="w-full p-2 border border-gray-600 bg-gray-900 text-white rounded mb-4"
                    rows="4"
                    placeholder="Write your reply here..."
                    value={replyMessage}
                    onChange={handleTextareaChange}
                    required
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>

            </div>

          )}






        </div>
      </section >
    </div >
  )
}

export default Community
