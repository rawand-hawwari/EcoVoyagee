import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

const Comments = (id) => {
  // console.log(id)
  const [comments, setComments] = useState([]);
  const [endpoint, setEndpoint] = useState(``);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [addEndpoint, setAddEndpoint] = useState(``);
  const [formattedComments, setFormattedComments] = useState({
    formattedDate: "",
    formattedTime: "",
  });
  const [formData, setFormData] = useState({
    comment_text: "",
  });
  const convertTimestampToDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return {
      formattedDate: `${day}/${month}/${year}`,
      formattedTime: `${hours}:${minutes}`,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = cookies["token"];

    if (id.type === "Accommodations") {
      setFormData({
        ...formData,
        accommodation_id: id.id,
      });
      try {
        axios
          .post(`http://localhost:3999/addComment/${id.id}`, formData, {
            headers: {
              authorization: `${token}`,
            },
          })
          .then((response) => {
            setFormData({
              comment_text: "",
            });
            fetchComments();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "You comment was added successfully.",
              confirmButtonText: "OK",
              customClass: {
                confirmButton:
                  "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
              },
            });
          });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error,
          confirmButtonText: "OK",
          customClass: {
            confirmButton:
              "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
          },
        });
      }
    } else if (id.type === "Packages") {
      axios
        .post(
          `http://localhost:3999/addCommentPac`,
          { packages_id: id.id, comment_text: formData.comment_text },
          {
            headers: {
              authorization: `${token}`,
            },
          }
        )
        .then((response) => {
          setFormData({
            comment_text: "",
          });
          fetchComments();
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "You comment was added successfully.",
            confirmButtonText: "OK",
            customClass: {
              confirmButton:
                "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
            },
          });
        });
    } else if (id.type === "Activities") {
      axios
        .post(`http://localhost:3999/addCommentPac/${id.id}`, formData)
        .then((response) => {
          setFormData({
            comment_text: "",
          });
        });
    }
  };

  const fetchComments = () => {
    let endpoint = "";
    if (id.type === "Accommodations") {
      endpoint = "getAccommodationsWithComments";
    } else if (id.type === "Packages") {
      endpoint = "getPackagesWithComments";
    } else if (id.type === "Activities") {
      endpoint = "getActivitiesWithComments";
    }
    axios
      .get(`http://localhost:3999/${endpoint}/${id.id}`)
      .then((response) => {
        // Handle the response data here
        setComments(response.data);
        const formattedData = response.data.map((comment) =>
          convertTimestampToDateTime(comment.comment_timestamp)
        );
        setFormattedComments(formattedData);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    fetchComments();
  }, [id]);
  //   console.log(comments);

  return (
    <div>
      <div>
        <h1 className="text-sky-700 text-start text-3xl font-bold">Reviews</h1>
        <div className="p-5">
          {comments.map((comment, index) => (
            <div className="p-5 border border-sky-700 rounded-xl my-3 w-3xl">
              <div className="flex gap-4 flex-wrap">
                <h5 className="text-start text-xl font-bold">
                  {comment.first_name}
                </h5>
                <h5 className="text-start text-xl font-bold pb-2">
                  {comment.last_name}
                </h5>
              </div>
              {/* {convertTimestampToDateTime(comment.comment_timestamp)} */}
              <p className="text-lg text-start text-gray-500 pb-5">
                {formattedComments[index].formattedDate} at{" "}
                {formattedComments[index].formattedTime}
              </p>
              <p className="text-lg text-start text-black pb-5">
                {comment.comment_text}
              </p>
            </div>
          ))}
        </div>
        <div className="p-5">
          <form action="" className="p-5 text-start" onSubmit={handleSubmit}>
            <label className="px-3 self-start">Add your comment</label>
            <textarea
              id="comment"
              value={formData.comment_text}
              onChange={(e) => setFormData({ comment_text: e.target.value })}
              className="w-full mb-3 p-2 border border-sky-700 rounded-md"
            />
            <button
              type="submit"
              className="py-3 w-64 text-xl text-white hover:text-sky-900 bg-sky-900 border-2 hover:bg-white border-sky-900 rounded-2xl"
            >
              Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Comments;
