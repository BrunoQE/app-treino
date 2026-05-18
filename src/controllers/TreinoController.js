import treino from "../models/Treino.js";

class TreinoController {

    // GET /treinos — lista todos os treinos com exercícios populados
    static async listarTreino(req, res) {
        try {
            const litarTreinos = await treino.find({ usuario: req.usuario._id }).populate('exercicios.exercicio').exec();
            console.log('Exercicios: ', litarTreinos);
            res.status(200).json(litarTreinos);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha na requisição` });
        }
    }

    // GET /treinos/:id — busca treino por ID
    static async listarTreinoPorId(req, res) {
        try {
            const listarTreinoPorId = await treino.findById(req.params.id).populate('exercicios.exercicio');

            if (!listarTreinoPorId)
                return res.status(404).json({ message: "Treino não encontrado" });

            res.status(200).json(listarTreinoPorId);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha na requisição` });
        }
    }

    // POST /treinos — cria novo treino
    static async cadastrarTreino(req, res) {
        try {
            const { nome, diaSugerido, programaId } = req.body;
            const treinoCriado = await treino.create({
                nome,
                diaSugerido,
                programa: programaId ?? null,
                usuario: req.usuario._id
            });
            const treinoCompleto = await treino.findById(treinoCriado._id).populate('exercicios.exercicio');
            res.status(201).json({ message: "Treino cadastrado com sucesso", treino: treinoCompleto });
        } catch (error) {
            console.error("erro:", error);
            res.status(500).json({ message: `${error.message} - falha ao cadastrar treino` });
        }
    }

    // PUT /treinos/:id — edita nome e/ou diaSugerido do treino
    static async alterarTreino(req, res) {
        try {
            const { nome, diaSugerido } = req.body;
            const treinoAtualizado = await treino.findByIdAndUpdate(
                req.params.id,
                { nome, diaSugerido },
                { new: true, runValidators: true })
                .populate('exercicios.exercicio');

            if (!treinoAtualizado)
                return res.status(404).json({ message: "Treino não encontrado" });

            res.status(200).json({ message: "treino alterado com sucesso.! ", treino: treinoAtualizado });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao atualizar treino` });
        }
    }

    // DELETE /treinos/:id — exclui treino
    static async removerTreino(req, res) {
        try {
            const treinoRemovido = await treino.findByIdAndDelete(req.params.id);

            if (!treinoRemovido)
                return res.status(404).json({ message: "Treino não encontrado" });

            res.status(204).json({ message: "Treino excluido com sucesso" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao remover treino` });
        }
    }

    // POST /treinos/:id/exercicios — adiciona exercício ao treino
    static async adicionarExercicioAoTreinoo(req, res) {
        try {
            const { exercicioId, serie, repeticoes, peso, tempoDescanso, tipo, tempoTotal, tempoPorSerie } = req.body;

            const treinoEncontrado = await treino.findById(req.params.id);
            if (!treinoEncontrado)
                return res.status(404).json({ message: "Treino não encontrado" });

            const proximaOrdem = treinoEncontrado.exercicios.length + 1;

            const novoExercicio = {
                exercicio: exercicioId,
                tipo: tipo ?? 'padrao',
                serie: serie ?? null,
                repeticoes: repeticoes ?? null,
                peso: peso ?? null,
                tempoDescanso: tempoDescanso ?? 60,
                tempoTotal: tempoTotal ?? null,
                tempoPorSerie: tempoPorSerie ?? null,
                ordem: proximaOrdem,
            };

            treinoEncontrado.exercicios.push(novoExercicio);
            await treinoEncontrado.save();

            const treinoAtualizado = await treino.findById(req.params.id).populate("exercicios.exercicio");
            res.status(201).json({ message: "Treino atualizado com sucesso", treino: treinoAtualizado });

        } catch (error) {
            console.log('ERRO DETALHADO:', error);
            res.status(500).json({ message: `${error.message} - falha ao atualizar treino` });
        }
    }

    // PUT /treinos/:id/exercicios/:exId — edita série, rep, peso de um exercício no treino
    static async editarExercicioNoTreino(req, res) {
        try {
            const treinoEncontrado = await treino.findById(req.params.id);
            if (!treinoEncontrado)
                return res.status(404).json({ message: "Treino não encontrado" });

            const exercicioNoTreino = await treinoEncontrado.exercicios.id(req.params.exId);
            if (!exercicioNoTreino)
                return res.status(404).json({ message: "Exercicio não encontrado no treino" });

            if (req.body.serie !== undefined) exercicioNoTreino.serie = req.body.serie;
            if (req.body.repeticoes !== undefined) exercicioNoTreino.repeticoes = req.body.repeticoes;
            if (req.body.peso !== undefined) exercicioNoTreino.peso = req.body.peso;
            if (req.body.ordem !== undefined) exercicioNoTreino.ordem = req.body.ordem;

            await treinoEncontrado.save();;

            const treinoAtualizado = await treino.findById(req.params.id).populate("exercicios.exercicio");
            res.status(201).json({ message: "Exercicio atualizado com sucesso", treino: treinoAtualizado });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao editar exercicio` });
        }
    }

    // DELETE /treinos/:id/exercicios/:exId — remove exercício do treino
    static async removerExercicioDoTreino(req, res) {
        try {
            const treinoEncontrado = await treino.findById(req.params.id);
            if (!treinoEncontrado)
                return res.status(404).json({ messagem: "Treino não encontrado" });

            const exercicioNoTreino = treinoEncontrado.exercicios.id(req.params.exId);
            if (!exercicioNoTreino)
                return res.status(404).json({ message: "Exercicio no treino não encontrado" });

            treinoEncontrado.exercicios.pull({ _id: req.params.exId });
            await treinoEncontrado.save();

            const treinoAtualizado = await treino.findById(req.params.id).populate("exercicios.exercicio");
            res.status(201).json({ message: "Exercicio removido do treino", treino: treinoAtualizado });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao editar exercicio` });
        }
    }

    // PATCH /treinos/:id/exercicios/ordem — reordena exercícios do treino
    // Body esperado: { ordem: [ { exId: "...", ordem: 1 }, { exId: "...", ordem: 2 } ] }
    static async ordernarExercicios(req, res) {
        try {
            const treinoEncontrado = await treino.findById(req.params.id);
            if (!treinoEncontrado)
                return res.status(404).json({ message: "Treino não encontrado" });

            const novaOrdem = req.body.ordem;
            novaOrdem.forEach(({ exId, ordem }) => {
                const ex = treinoEncontrado.exercicios.id(exId);
                if (ex) ex.ordem = ordem;
            });

            treinoEncontrado.exercicios.sort((a, b) => a.ordem - b.ordem);
            await treinoEncontrado.save();

            const treinoAtualizado = await treino.findById(req.params.id).populate("exercicios.exercicio");
            res.status(201).json({ message: "Ordem atualizada com sucesso", treino: treinoAtualizado });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao reordenar exercicio` });
        }
    }

}

export default TreinoController;