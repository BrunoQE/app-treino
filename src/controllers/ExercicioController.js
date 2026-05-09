import exercicio from "../models/Exercicios.js";
import treino from "../models/Treino.js";

class ExercicioController {

    static async listarExercicios(req, res) {
        try {
            const listarExercicios = await exercicio.find({});
            res.status(200).json(listarExercicios);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha na requisição` });
        }
    }

    static async listarExercicioPorId(req, res) {
        try {
            const buscarExercicioPorId = await exercicio.findById(req.params.id);
            if (!buscarExercicioPorId)
                return res.status(404).json({ message: "Exercicio não encontrado" });

            res.status(200).json(buscarExercicioPorId);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha na requisição` });
        }
    }

    static async listarExercicioPorGrupoMuscular(req, res) {
        const grupoMuscular = req.query.grupo;
        try {
            const exericioPorGrupoMuscular = await exercicio.find({ grupoMuscular: grupoMuscular });
            if (exericioPorGrupoMuscular.length === 0)
                return res.status(404).json({ message: "Exercicio não encontrado" });
            res.status(200).json(exericioPorGrupoMuscular);
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha na requisição` });
        }
    }

    static async cadastrarExercicio(req, res) {
        try {
            const cadastrarExercicio = await exercicio.create(req.body);
            res.status(201).json({ message: "exercicio cadastrado com sucesso", exercicio: cadastrarExercicio });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao cadastrar exercicio` });
        }
    }

    static async alterarExercicio(req, res) {
        try {
            const { nome, grupoMuscular } = req.body;
            const exercicioAtualizado = await exercicio.findByIdAndUpdate(
                req.params.id,
                { nome, grupoMuscular },
                { new: true, runValidators: true });

            if (!exercicioAtualizado)
                return res.status(404).json({ message: "Exercicio não encontrado" });

            res.status(200).json({ message: "Exercicio alterado com sucesso", exercicio: exercicioAtualizado });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao alterar exercicio` });
        }
    }

    static async removerExercicio(req, res) {
        try {
            const vinculo = await treino.findOne({ 'exercicios.exercicio': req.params.id });
            if (vinculo)
                return res.status(400).json({ message: "Exercício está vinculado a um treino e não pode ser excluído. Remova-o do treino primeiro." });

            const exercicioParaRemover = await exercicio.findByIdAndDelete(req.params.id);
            if (!exercicioParaRemover)
                return res.status(404).json({ message: "Exercicio não encontrado" });

            res.status(200).json({ message: "Exercicio deletado com sucesso" });
        } catch (error) {
            res.status(500).json({ message: `${error.message} - falha ao remover exercicio` });
        }
    }

}

export default ExercicioController;