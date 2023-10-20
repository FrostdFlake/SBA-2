// The provided course information.
const courseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const assignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// //The individual assignments
// const assignment1 =  {
//       id: 1,
//       name: "Declare a Variable",
//       due_at: "2023-01-25",
//       points_possible: 50
//     }
// const assignment2 =   {
//       id: 2,
//       name: "Write a Function",
//       due_at: "2023-02-27",
//       points_possible: 150
//     }
// const assignment3 = {
//       id: 3,
//       name: "Code the World",
//       due_at: "3156-11-15",
//       points_possible: 500
//     }

// The provided learner submission data.
const learnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  },
  {
    learner_id: 150,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-02-25",
      score: 50
    }
  },
  {
    learner_id: 150,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 130
    }
  },
  {
    learner_id: 150,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-02-25",
      score: 450
    },}
];

function getLearnerData(course, ag, submissions) {
  // here, we would process this data to achieve the desired result.
  const result = [
    {
      id: 125,
      avg: 0.985, // (47 + 150) / (50 + 150)
      1: 0.94, // 47 / 50
      2: 1.0 // 150 / 150
    },
    {
      id: 132,
      avg: 0.82, // (39 + 125) / (50 + 150)
      1: 0.78, // 39 / 50
      2: 0.833 // late: (140 - 15) / 150
    }
  ];

  return result;
}

const result = getLearnerData(courseInfo, assignmentGroup, learnerSubmissions);

console.log(result);


//Date checker for submissions
function checkLateSubmissions(submissions, assignmentGroup) {
  submissions.forEach(submission => {
    const learnerId = submission.learner_id;
    const assignmentId = submission.assignment_id;
    const submittedAt = new Date(submission.submission.submitted_at);
    const assignmentInfo = assignmentGroup.assignments.find(assignment => assignment.id === assignmentId);

    if (assignmentInfo) {
      const dueDate = new Date(assignmentInfo.due_at);

      if (submittedAt > dueDate) {
        console.log(`Late Submission: Learner ID ${learnerId}, Assignment: ${assignmentInfo.name}`);
      }
    }
  });
}
console.log(checkLateSubmissions(learnerSubmissions, assignmentGroup));


//Date checker for due date
function checkDueDates(assignmentGroup) {
  const unexpectedDueDate = new Date("2023-03-26");

  assignmentGroup.assignments.forEach(assignment => {
    try {
      const dueDate = new Date(assignment.due_at);

      if (dueDate > unexpectedDueDate) {
        console.log(`Unexpected Due Date: ${assignment.name}`);
      }
    } catch (error) {
      console.error(`Error parsing due date for assignment: ${assignment.name}`);
    }
  });
}
console.log(checkDueDates(assignmentGroup));


//gets each student's average 
function calculateAndLogAverageGrades(submissions, assignmentGroup) {
  const learnerAverages = {};

  for (let i = 0; i < submissions.length; i++) {
    const submission = submissions[i];
    const learnerId = submission.learner_id;
    let score = submission.submission.score;
    const assignmentId = submission.assignment_id;
    const assignmentInfo = assignmentGroup.assignments.find(assignment => assignment.id === assignmentId);

    if (!learnerAverages[learnerId]) {
      learnerAverages[learnerId] = { totalScore: 0, totalPointsPossible: 0 };
    }

    if (assignmentInfo) {
      const pointsPossible = assignmentInfo.points_possible;
      if (typeof pointsPossible === 'number') {
        const dueDate = new Date(assignmentInfo.due_at);
        const submittedAt = new Date(submission.submission.submitted_at);

        if (submittedAt > dueDate) {
          score -= (score * 0.10);
        }

        learnerAverages[learnerId].totalScore += score;
        learnerAverages[learnerId].totalPointsPossible += pointsPossible;
      }
    }
  }
  for (const learnerId in learnerAverages) {
    if (learnerAverages.hasOwnProperty(learnerId)) {
      const learnerData = learnerAverages[learnerId];
      if (learnerData.totalPointsPossible > 0) {
        const averageGrade = (learnerData.totalScore / learnerData.totalPointsPossible) * 100;
        console.log(`Learner ID: ${learnerId}, Average Grade: ${averageGrade.toFixed(2)}%`);
      }
    }
  }
}
console.log(calculateAndLogAverageGrades(learnerSubmissions, assignmentGroup));


//Curve grades based on points
function curveAssignmentOneScores(submissions, assignmentGroup) {
  const assignmentIdToCurve = 1;
  const curveAmount = 10;

  const curvedSubmissions = submissions.map(submission => {
    let learnerId = submission.learner_id;
    let assignmentId = submission.assignment_id;
    let score = submission.submission.score;
    let assignmentInfo = assignmentGroup.assignments.find(assignment => assignment.id === assignmentId);

    if (assignmentId === assignmentIdToCurve && assignmentInfo) {
      const curvedScore = Math.min(score + curveAmount, assignmentInfo.points_possible);
      submission.submission.score = curvedScore;
    }

    return submission;
  });

  return curvedSubmissions;
}
const curvedSubmissions = curveAssignmentOneScores(learnerSubmissions, assignmentGroup);
console.log(calculateAndLogAverageGrades(curvedSubmissions, assignmentGroup));


// //trying to play with second curve
// function calculateAndLogAverageGrades2(submissions, assignmentGroup) {
//   const learnerAverages = {};

//   for (let i = 0; i < submissions.length; i++) {
//     const submission = submissions[i];
//     const learnerId = submission.learner_id;
//     let score = submission.submission.score;
//     const assignmentId = submission.assignment_id;
//     const assignmentInfo = assignmentGroup.assignments.find(assignment => assignment.id === assignmentId);

//     if (!learnerAverages[learnerId]) {
//       learnerAverages[learnerId] = { totalScore: 0, totalPointsPossible: 0 };
//     }

//     if (assignmentInfo) {
//       const pointsPossible = assignmentInfo.points_possible;
//       if (typeof pointsPossible === 'number') {
//         const dueDate = new Date(assignmentInfo.due_at);
//         const submittedAt = new Date(submission.submission.submitted_at);

//         if (submittedAt > dueDate) {
//           score -= (score * 0.10);
//         }

//         learnerAverages[learnerId].totalScore += score;
//         learnerAverages[learnerId].totalPointsPossible += pointsPossible;
//       }
//     }
//   }
//   for (const learnerId in learnerAverages) {
//     if (learnerAverages.hasOwnProperty(learnerId)) {
//       const learnerData = learnerAverages[learnerId];
//       if (learnerData.totalPointsPossible > 0) {
//         const averageGrade = (learnerData.totalScore / learnerData.totalPointsPossible) * 100;
//         console.log(`Learner ID: ${learnerId}, Average Grade: ${averageGrade.toFixed(2)}%`);
//       }
//     }
//   }
// }
// console.log(calculateAndLogAverageGrades2(learnerSubmissions, assignmentGroup));
//When placed under first curve, it adopts the curve score



// //curve grade by percentage - Can't figure out how to reset previous curve and just run this one
// function curveAssignmentByPercentage(submissions, assignmentGroup, assignIdToCurve, curvePercentage) {
//   const newCurvedSubmissions = submissions.map(submission => {
//     let learnerId = submission.learner_id;
//     let assignmentId = submission.assignment_id;
//     let score = submission.submission.score;
//     let assignmentInfo = assignmentGroup.assignments.find(assignment => assignment.id === assignmentId);

//     if (assignmentId === assignIdToCurve && assignmentInfo) {
//       const curvedPercentScore = score + (score * curvePercentage);
//       submission.submission.score = Math.min(curvedPercentScore, assignmentInfo.points_possible);
//     }

//     return submission;
//   });

//   return newCurvedSubmissions;
// }
// let assignIdToCurve = 3;
// let curvePercentage = 0.20;
// const newCurvedSubmissions = curveAssignmentByPercentage(learnerSubmissions, assignmentGroup, assignIdToCurve, curvePercentage);
// console.log(calculateAndLogAverageGrades(newCurvedSubmissions, assignmentGroup));
// //Keep getting undefined in the console, but with the proper results