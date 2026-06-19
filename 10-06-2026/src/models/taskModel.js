const createAluno = (id, nome, turma, curso) => {
  return {
    id,
    nome,
    turma,
    curso
  };
};

module.exports = { createAluno };