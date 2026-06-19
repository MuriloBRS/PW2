const { createAluno } = require('../models/taskModel');

let tasks = [];
let idCounter = 1;

const fs = require('fs');
const path = require('path');

const alunosFile = path.join(__dirname, '../../Alunos.json');

const addAluno = (nome, turma, curso) => {
  if (!nome || !turma || !curso) {
    throw new Error('Todos os campos são obrigatórios');
  }

  const alunos = JSON.parse(fs.readFileSync(alunosFile, 'utf8'));

  const novoId =
    alunos.length > 0
      ? Math.max(...alunos.map(a => a.id)) + 1
      : 1;

  const aluno = createAluno(novoId, nome, turma, curso);

  alunos.push(aluno);

  fs.writeFileSync(alunosFile, JSON.stringify(alunos, null, 2));

  return aluno;
};

const atualizarAluno = (id, nome, turma, curso) => {
  const alunos = JSON.parse(fs.readFileSync(alunosFile, 'utf8'));
  const alunoIndex = alunos.findIndex(a => a.id == id);

  if (alunoIndex === -1) {
    throw new Error('Aluno não encontrado');
  }

  if (!nome || !turma || !curso) {
    throw new Error('Todos os campos são obrigatórios');
  }

  alunos[alunoIndex] = { ...alunos[alunoIndex], nome, turma, curso };

  fs.writeFileSync(alunosFile, JSON.stringify(alunos, null, 2));

  return alunos[alunoIndex];
};

const deleteAluno = (id) => {
  const alunos = JSON.parse(fs.readFileSync(alunosFile, 'utf8'));
  const alunoIndex = alunos.findIndex(a => a.id == id);
  if (alunoIndex === -1) {
    throw new Error('Aluno não encontrado');
  }
  const alunoExcluido = alunos.splice(alunoIndex, 1)[0];
  fs.writeFileSync(alunosFile, JSON.stringify(alunos, null, 2));
  return alunoExcluido;
};

module.exports = {
  addAluno,
  atualizarAluno,
  deleteAluno
};
