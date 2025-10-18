await db.collection("applications").add({
  jobTitle,
  applicantName,
  applicantEmail,
  coverLetter,
  resumeUrl,
  status: "pending",
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});