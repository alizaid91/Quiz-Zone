function formatNumber(num) {
  const rounded = Math.round(num * 100) / 100;

  if (Number.isInteger(rounded)) {
    return rounded;
  } else {
    return rounded.toFixed(2);
  }
}

export function Calculator(quiz, responeces) {
  const totalQuestions = responeces.length;
  const attempted = responeces.filter(
    (responce) => responce.status === "answerd"
  );
  const correct = attempted.filter(
    (question) => question.selectedOption === question.correctOption
  );
  const incorrect = attempted.filter(
    (question) => question.selectedOption !== question.correctOption
  );
  const notAttempted = responeces.filter(
    (responce) => responce.status === "not answered"
  );

  const score = (correct.length / totalQuestions) * 100;

  const accuracy = (correct.length / attempted.length) * 100;

  const result = {
    score: score.toFixed(2),
    totalQuestions: totalQuestions,
    attempted: attempted.length,
    correct: correct.length,
    incorrect: incorrect.length,
    notAttempted: notAttempted.length,
    accuracy: formatNumber(accuracy),
  };

  return [result];
}
