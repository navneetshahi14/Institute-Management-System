"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import ActionButton from "../superAdmin/ActionButton";
import { useManagement } from "@/context/ManagementContext";

const Faculty = () => {
  const getPenaltyCount = (user) => {
    const counts = {
      LATE_START: 0,
      EARLY_END: 0,
      BOTH: 0,
      TOTAL: 0,
    };

    user.lectures.forEach((lec) => {
      if (!Array.isArray(lec.attendance)) return;

      lec.attendance.forEach((att) => {
        if (!att.penalty || att.penalty === "NONE") return;

        counts[att.penalty]++;
        counts.TOTAL++;
      });
    });

    return counts;
  };

  const lists = [
    "Id",
    "Faculty Name",
    "Phone No.",
    "Courses",
    "Subjects",
    "Total Lectures",
    "Lectures Done",
    "Remaining",
    "Penalty Count",
  ];

  const [users, setUsers] = useState([]);

  const { fetchUser } = useManagement();
  const [penalty, setPenalty] = useState(null);

  const getLectureAttendanceStats = (lectures) => {
    let conducted = 0;
    let late = 0;
    let early = 0;
    let both = 0;
    let totalPenalty = 0;
    let totalScheduled = 0;
    let subject = [];
    let course = [];
    let batch = [];

    lectures.forEach((lec) => {
      totalScheduled += lec.TotalScheduled || 0;

      subject.push(lec?.subject?.name + "-" + lec?.batch?.name);
      course.push(lec?.batch?.course?.name);

      lec.attendance.forEach((att) => {
        conducted++;

        if (att.penalty === "LATE_START") late++;
        if (att.penalty === "EARLY_END") early++;
        if (att.penalty === "BOTH") both++;
        if (att.penalty !== "NONE") totalPenalty++;
      });
    });

    return {
      conducted,
      remaining: totalScheduled - conducted,
      late,
      early,
      both,
      totalPenalty,
      subject,
      course,
      batch,
      totalScheduled,
    };
  };

  useEffect(() => {
    const loaddata = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const branchId = user.data.user.branchId;
      console.log(branchId);

      const userDate = await fetchUser();

      const filterData = userDate
        .filter((user) => user.role === "FACULTY")
        .filter((user) => user.branchId === branchId);
      console.log(filterData);

      setUsers(filterData);
    };

    loaddata();
  }, []);

  return (
    <div className="h-[91%] bg-white m-2 rounded p-4 py-6 flex flex-wrap gap-5 flex-col items-center ">
      <div className="w-full h-full overflow-auto xl:overflow-x-hidden ">
        <ul className="grid grid-cols-[60px_180px_220px_200px_140px_140px_120px_140px_150px_150px] xl:grid-cols-9 px-4 py-3 xl:border-b xl:border-gray-500 font-bold text-center">
          {lists.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        {users.map((user, index) => {
          const penalty = getPenaltyCount(user);
          console.log(user);
          const stats = getLectureAttendanceStats(user.lectures);
          return (
            <ul
              key={index}
              className="grid grid-cols-[60px_180px_220px_200px_140px_140px_120px_140px_150px_150px] xl:grid-cols-9 px-4 py-3 xl:border-b xl:border-gray-500 text-center items-center text-wrap hover:bg-gray-50"
            >
              <li className="font-semibold">{index + 1}</li>
              <li className="flex items-center justify-center gap-2">
                {user.name}
                <div
                  className={`${user.isActive ? "" : "bg-red-500  h-2 w-2 rounded-full "}`}
                ></div>
              </li>
              <li>
                {user.phoneNumber}
              </li>
              <li>{stats.course.length > 0 ? stats.course.join(", ") : "-"}</li>
              <li>
                {stats.subject.length > 0 ? stats.subject.join(", ") : "-"}
              </li>

              {/* <li>{stats.batch.join(", ")}</li> */}
              <li>{stats.totalScheduled}</li>
              <li>{stats.conducted}</li>
              <li>{stats.remaining}</li>
              <li>{penalty.TOTAL}</li>
              {/* <li>{stats.late}</li>
                  <li>{stats.early}</li>
                  <li>{stats.both}</li>
                  <li>{stats.totalPenalty}</li> */}
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default Faculty;
