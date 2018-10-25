/**
 * QuizController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    QuizesLivresConteudo: async function (inputs, res) { // Retorna todos os quizes que nao tem conteudo associado
        let quizes = await Quiz.find().populate('conteudo');
        let livres = [];
        quizes.forEach(quiz => {
            if (quiz.conteudo.length == 0){ // Se nao tiver conteudo associado (array sem dados)
                livres.push(quiz);
            }
        });
        return res.json(livres);
    },

    getQuizes: async function (req, res) {
        let id = req.param('id');
        let response;
        if (id)
            response = await Quiz.findOne({id: id}).populate('conteudo').populate('questoes');
        else 
            response = await Quiz.find().populate('conteudo').populate('questoes');
        return res.status(200).json(response);
    },

    patchQuiz: async function (req, res) {
        if (req.session.User === undefined || req.session.User.role == 'aluno')
            return res.badRequest('ACESSO RESTRITO');
        
        let id = req.param('id');
        await Quiz.update({id: id}).set(req.body);
        let record = await Quiz.findOne({id: id}).populate('conteudo').populate('questoes').populate('ownerAtividade');
        return res.status(200).json(record);
    },

    deleteQuiz: async function (req, res) {
        if (req.session.User === undefined || req.session.User.role == 'aluno')
            return res.badRequest('ACESSO RESTRITO');
        
        let id = req.param('id');
        await Quiz.destroy({id: id});
        return res.status(200).json('ok');
    },

    createQuiz: async function (req, res) {
        if (req.session.User === undefined || req.session.User.role == 'aluno')
            return res.badRequest('ACESSO RESTRITO');
        // console.log(req.body);
        await Quiz.create(req.body);
        return res.status(200).json('ok');
    },
};