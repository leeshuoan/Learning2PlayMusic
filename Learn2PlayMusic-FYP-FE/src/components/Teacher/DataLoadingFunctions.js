export const handleCourseInfo = async (getCourseAPI, setCourse) => {
  const [data] = await getCourseAPI;
  const course = {
    id: data.SK.split("#")[1],
    name: data.CourseName,
    timeslot: data.CourseSlot,
    teacher: data.TeacherName,
  };
  setCourse(course);
};
export const handleCourseClassList = async (getClassListAPI, setClassList) => {
  const data = await getClassListAPI;
  setClassList(data);
};
export const handleCourseAnnouncements = async (getCourseAnnouncementsAPI, setCourseAnnouncements) => {
  const data = await getCourseAnnouncementsAPI;
  console.log(data);
  const announcementsData = data.map((announcement) => {
    const id = announcement.SK.split("Announcement#")[1];
    const date = new Date(announcement.Date);
    // const formattedDate = date.toLocaleDateString(); // change to pass date obj so that react table wil sort!
    return { ...announcement, id, Date: date };
  });
  setCourseAnnouncements(announcementsData);
};
export const handleCourseHomework = async (getHomeworkAPI, setCourseHomework) => {
  const data = await getHomeworkAPI;
  const homeworkData = data.map((homework) => {
    const id = homework.SK.split("Homework#")[1];
    const dueDate = new Date(homework.HomeworkDueDate);
    // const formattedDueDate = `${dueDate.toLocaleDateString()} `;// change to pass date obj so that react table wil sort!
    return { ...homework, id, HomeworkDueDate: dueDate };
  });
  setCourseHomework(homeworkData);
};
export const handleCourseMaterial = async (getMaterialAPI, setCourseMaterial) => {
  const data = await getMaterialAPI;
  const materialData = data.map((material) => {
    const id = material.SK.split("Material#")[1];
    const date = new Date(material.MaterialLessonDate);
    const formattedDate = `${date.toLocaleDateString()}`;
    return { ...material, id, MaterialLessonDate: formattedDate };
  });
  setCourseMaterial(materialData);
};
export const handleCourseQuiz = async (getQuizAPI, setCourseQuiz) => {
  const data = await getQuizAPI;
  const quizData = data.map((quiz) => {
    const id = quiz.SK.split("Quiz#")[1];
    const date = new Date(quiz.QuizDueDate);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    return { ...quiz, id };
  });
  setCourseQuiz(quizData);
};

//old
/*
      if (category == "classlist") {
        const data6 = await getClassListAPI;
        console.log(data6);
        setClassList(data6);
      }
      if (category == "announcements") {
        const data5 = await getCourseAnnouncementsAPI;
        const announcementsData = data5.map((announcement) => {
          const id = announcement.SK.split("Announcement#")[1];
          const date = new Date(announcement.Date);
          const formattedDate = date.toLocaleDateString();
          return { ...announcement, id, Date: formattedDate };
        });
        setCourseAnnouncements(announcementsData);
      }
      if (category == "homework") {
        const data2 = await getHomeworkAPI;
        const homeworkData = data2.map((homework) => {
          const id = homework.SK.split("Homework#")[1];
          const dueDate = new Date(homework.HomeworkDueDate);
          const formattedDueDate = `${dueDate.toLocaleDateString()} `;
          return { ...homework, id, HomeworkDueDate: formattedDueDate };
        });
        setCourseHomework(homeworkData);
      }
      if (category == "material") {
        const data3 = await getMaterialAPI;
        const materialData = data3.map((material) => {
          const id = material.SK.split("Material#")[1];
          const date = new Date(material.MaterialLessonDate);
          const formattedDate = `${date.toLocaleDateString()}`;
          return { ...material, id, MaterialLessonDate: formattedDate };
        });
        setCourseMaterial(materialData);
      }
      if (category == "quiz") {
        const quizData = data4.map((quiz) => {
          const id = quiz.SK.split("Quiz#")[1];
          const date = new Date(quiz.QuizDueDate);
          const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          return { ...quiz, id };
        });
        setCourseQuiz(quizData);
      }

*/
