'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('rest_quarter','root','',{ // rest_quarter -> numele bazei de date
  dialect : 'mysql',
  define : {
    timestamps : false // nu se creaza fieldurile createdAt si updatedAt
  }
});

//entitati
const User = sequelize.define('user', {
    name : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
          len : [2, 100] // nu stiu de ce vreti 100, mie mi se pare putin cam mult :))) dar ok
        }
    },
    email : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
            isEmail : true // verifica daca are format de email sau nu (ceva@altceva.tld)
        }
    },
    password : { // aici vreti lungime de 20. Fiind parola, cu cat mai lunga, cu atat mai sigura, asa ca nu ii pun restrictie
        type : Sequelize.STRING,
        allowNull : false,
    },
    type : {
        type : Sequelize.BOOLEAN, // in sequelize nu exista tinyint asa ca am pus boolean pt ca e same shit
        allowNull : false,
        defaultValue : false, // default 0 adica e la nivelul de student daca nu il construiti din client specific sa fie prof 
        validate : {
            isBoolean : true // ca sa nu aveti probleme in caz ca se trimite altceva decat true/false
        }
    }
});

const Category = sequelize.define('category', {
    title : { // suna mai bine titlu decat nume
        type : Sequelize.STRING,
        allowNull : false
    }
});

const Test = sequelize.define('test', {
    title : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
          len : [2, 50]
        }
    },
    active : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : true,
        validate : {
            isBoolean : true
        }
    },
    isPublic : { // nu am voie sa folosesc 'public' (este rezervat) asa ca am pus 'isPublic'
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : true,
        validate : {
            isBoolean : true
        }
    },
    accessCode : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
          len : [4, 10]
        }
    },
    accessNumbers : {
        type : Sequelize.INTEGER,
        allowNull : false,
        defaultValue : 0,
        validate : {
          isNumeric : true,
          isInt : true,
          min : 0,
          max : 99 // v-ati aruncat cam mult la 11 digits. Cred ca 2 sunt mai mult decat suficiente
        }
    },
    time : { // time active nu are rost sa il includ, i-am explicat lui Alice de ce
        type : Sequelize.INTEGER, // asta cand ajunge la client o sa fie o functie gen date.now().getMinutes() la care o sa adaugati asta
        allowNull : false, // deci luati fieldul asta ca fiind un numar de minute
        validate : {
          isNumeric : true,
          isInt : true,
          min : 1,
          max : 180 // 3 ore sunt suficiente pt orice fel de test
        }
    }
});

const Question = sequelize.define('question', {
    text : {
        type : Sequelize.TEXT, // TEXT in caz ca are mai mult de 255 de caractere
        allowNull : false
    } // restul atributelor sunt ori inutile ori redundante, asa ca nu are rost sa le pun. Am discutat asta cu Alice
});

const Answer = sequelize.define('answer', {
    text : {
        type : Sequelize.TEXT,
        allowNull : false
    },
    correct : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : true,
        validate : {
            isBoolean : true
        }
    }
});

const TakenTest = sequelize.define('takenTest', { // se va crea in baza de date la inceperea testului, iar la sfarsit se vor updata scorul si timpul,
    highScore : { // pentru a se putea crea referintele cu tabelul answeredQuestions.
        type : Sequelize.INTEGER, // Avand in vedere structura tabelei, se va memora un singur scor, asa ca banuiesc ca se va dori sa fie scorul maxim
        allowNull : false, // si timpul aferent acestuia
        validate : {
          isNumeric : true,
          isInt : true,
          min : 0,
          max : 100 // sau daca vreti precizie mai mare la notare mai bagati un 0; 11 digits este exagerat de mult
        }
    },
    timesSubmitted : { // dinnou mi se par cam multe 11 digits pt asa ceva :)))))
        type : Sequelize.INTEGER,
        // allowNull : false,
        default : 0, // cand se creaza pt prima data va fi 0, pt a putea fi incrementat ulterior, cand se updateaza si timpul si scorul
        validate : {
          isNumeric : true,
          isInt : true,
          min : 0,
          max : 100 // sau daca vreti precizie mai mare la notare mai bagati un 0
        }
    },
    time : { // cred ca cel mai bine este sa memoram in secunde, si cand se afiseaza undeva, se converteste foarte usor in ore/minute/secunde
        type : Sequelize.INTEGER, // Daca vreti puteti memora si in milisecunde, este la fel de usor
        allowNull : false,
        validate : {
          isNumeric : true,
          isInt : true,
          min : 0,
          max : 10800 // echivalentul pt cele 3 ore max de mai sus (180 minute * 60s)
        }
    }
});

const AnsweredQuestion = sequelize.define('answeredQuestion'); // scorul se calculeaza pe client si se aduna si trimite in server la sfarsit
const MyAnswer = sequelize.define('myAnswer');

//relatii
Category.hasMany(Test); // fiecare categorie are mai multe teste
Test.hasMany(Question); // fiecare test are mai multe intrebari
Question.hasMany(Answer); // fiecare intrebare are mai multe variante de raspuns
User.hasMany(TakenTest); // fiecare user are unul sau mai multe teste date
Test.hasMany(TakenTest); // fiecare test poate fi dat odata sau de mai multe ori
TakenTest.hasMany(AnsweredQuestion); // fiecare test dat are una sau mai multe intrebari raspunse
Question.hasMany(AnsweredQuestion); // fiecare intrebare a fost raspunsa cel putin odata
AnsweredQuestion.hasMany(MyAnswer); // fiecare intrebare raspunsa are un raspuns (hasOne) sau mai multe in cazul in care aveti raspuns multiplu
Answer.hasMany(MyAnswer); // fiecare varianta de raspuns a fost folosita cel putin odata pentru a raspunde la o intrebare

const app = express();
app.use(bodyParser.json());
app.use(express.static('/quarter/build'));

//rute
app.get('/create', async (req, res) => { // cream baza de date conform structurii de mai sus
	try{
		await sequelize.sync({force : true});
		res.status(201).json({message : 'created'});
	} catch(e){
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.post('/login', async (req, res) => { // din formul de login se va face post aici cu credentialele
    try{
        let user = await User.findOne({where : {email : req.body.email}});
        if(user.password === req.body.password){
            console.log("S-a autentificat userul cu emailul " + req.body.email);
            return res.status(202).redirect('/users/' + user.id); // redirectioneaza pe pagina userului respectiv
        }
        else {
            console.log("Userul cu emailul " + req.body.email + " NU a reusit sa se autentifice");
            alert("Email sau parola INCORECTA!");
        }
    } catch(e){
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.get('/categories', async (req, res) => { // returneaza lista cu categorii
    try{
        let categories = await Category.findAll();
        res.status(200).json(categories);
    } catch(e){
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.get('/categories/:id', async (req, res) => { // returneaza lista cu categorii
    try{
        let category = await Category.findById(req.params.id);
        res.status(200).json(category);
    } catch(e){
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.post('/categories', async (req, res) => { // cand se adauga o categorie noua
	try{
		await Category.create(req.body);
		res.status(201).json({message : 'created'});
	} catch(e){
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.put('/categories/:id', async (req, res) => { // daca se doreste modificarea unei categorii
	try{
		let category = await Category.findById(req.params.id);
		if (category){
			await category.update(req.body);
			res.status(202).json({message : 'accepted'});
		}
		else{
			res.status(404).json({message : 'not found'});
		}
	} catch(e){
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.delete('/categories/:id', async (req, res) => { // daca se doreste eliminarea unei categorii
	try{
		let category = await Category.findById(req.params.id);
		if (category){
			await category.destroy();
			res.status(202).json({message : 'accepted'});
		}
		else{
			res.status(404).json({message : 'not found'});
		}
	} catch(e){
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.get('/categories/:id/tests', async (req, res) => { // returneaza o categorie cu toate testele aferente
	try {
		let category = await Category.findById(req.params.id);
		if (category){
			let tests = await category.getTests();
			res.status(200).json(tests);
		}
		else{
			res.status(404).json({message : 'not found'});
		}
	} catch (e) {
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.get('/categories/:cid/tests/:tid', async (req, res) => { // returneaza un anumit test dintr-o anumita categorie
	try {
		let category = await Category.findById(req.params.cid);
		if (category){
			let test = await category.getTests({where : {id : req.params.tid}});
			res.status(200).json(test);
		}
		else{
			res.status(404).json({message : 'not found'});
		}
	} catch (e) {
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.post('/categories/:id/tests', async (req, res) => { // adauga un test intr-o categorie
    try {
        let category = await Category.findById(req.params.id);
        if(category){
            let test = req.body;
            test.categoryId = category.id;
            await Test.create(test);
            console.log(req.body);
            res.status(201).json({message: 'created'});
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.put('/categories/:cid/tests/:tid', async (req, res) => { // modifica un test dintr-o categorie
    try {
        let category = await Category.findById(req.params.cid);
        if(!category){
            res.status(404).json({message : 'not found'});
        }
        else{
            let test = await Test.findById(req.params.tid);
            if(!test){
                res.status(404).json({message : 'not found'});
            }
            else{
                await test.update(req.body);
                res.status(202).json({message: 'accepted'});
            }
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.delete('/categories/:cid/tests/:tid', async (req, res) => { // sterge un test dintr-o categorie
    try {
        let category = await Category.findById(req.params.cid);
        if(!category){
            res.status(404).json({message : 'not found'});
        }
        else{
            let tests = await category.getTests({where : {id : req.params.tid}});
            let test = tests.shift();
            if(!test){
                res.status(404).json({message : 'not found'});
            }
            else{
                await test.destroy();
                await Question.destroy({where : {testId : req.params.tid}}); // se sterg si intrebarile aferente testului
                res.status(202).json({message: 'accepted'});
            }
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.get('/categories/:cid/tests/:tid/questions', async (req, res) => { // returneaza intrebarile dintr-un test a unei categorii -> cererea asta va fi facuta in timpul testului si se va itera prin fiecare       }
    try{
        let questions = await Question.findAll({where : {testId : req.params.tid}});
        if(!questions){
            res.status(404).json({message : 'not found'});
        }
        else{
		    res.status(200).json(questions);
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.post('/categories/:cid/tests/:tid/questions', async (req, res) => { // adauga intrebarile intr-un anumit test
    try{
        let test = Test.findById(req.params.tid);
        if(!test){
            res.status(404).json({message : 'not found'});
        }
        else{
            let question = req.body;
            question.testId = req.params.tid;
            await Question.create(question);
	        res.status(201).json({message : 'created'});
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.put('/categories/:cid/tests/:tid/questions/:qid', async (req, res) => { // modifica o intrebare dintr-un test
    try {
        let category = await Category.findById(req.params.cid);
        if(!category){
            res.status(404).json({message : 'not found'});
        }
        else{
            let tests = await category.getTests({where : {id : req.params.tid}});
            let test = tests.shift();
            if(!test){
                res.status(404).json({message : 'not found'});
            }
            else{
                let questions = await test.getQuestions({where : {id : req.params.qid}});
                let question = questions.shift();
                if(!question){
                    res.status(404).json({message : 'not found'});
                }
                else{
                    await question.update(req.body);
                    res.status(202).json({message: 'accepted'});
                }
            }
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.delete('/categories/:cid/tests/:tid/questions/:qid', async (req, res) => { // sterge o intrebare dintr un test
    try {
        let question = await Question.findById(req.params.qid);
        if(!question){
            res.status(404).json({message : 'not found'});
        }
        else{
            await question.destroy();
            await Answer.destroy({where : {questionId : req.params.qid}}); // se sterg si raspunsurile aferente intrebarii
            res.status(202).json({message: 'accepted'});
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.get('/categories/:cid/tests/:tid/questions/:qid/answers', async (req, res) => { // returneaza variantele de raspuns de la o intrebare. Daca nu se foloseste getul pe intrebare, puteti lua raspunsurile separat de aici
    try{ // din nou nu cred ca e nevoie de get pe raspuns individual, pt ca o sa aiba toate raspunsurile disponibile cand trebuie sa raspunda la intreabare
        let question = await Question.findById(req.params.qid);
        if(!question){
            res.status(404).json({message : 'not found'});
        }
        else{
            let answers = await question.getAnswers();
	        res.status(200).json(answers);
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.post('/categories/:cid/tests/:tid/questions/:qid/answers', async (req, res) => { // adauga raspunsul la o anumita intrebare dintr-un anume test
    try{
        let question = await Question.findById(req.params.qid);
        if(!question){
            res.status(404).json({message : 'not found'});
        }
        else{
            let answer = req.body;
            answer.questionId = question.id;
			await Answer.create(answer);
			res.status(201).json({message : 'created'});
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.put('/categories/:cid/tests/:tid/questions/:qid/answers/:aid', async (req, res) => { // modifica o varianta de raspuns a unei anumite intrebari dintr un anume test
    try {
        let category = await Category.findById(req.params.cid);
        if(!category){
            res.status(404).json({message : 'not found'});
        }
        else{
            let tests = await category.getTests({where : {id : req.params.tid}});
            let test = tests.shift();
            if(!test){
                res.status(404).json({message : 'not found'});
            }
            else{
                let questions = await test.getQuestions({where : {id : req.params.qid}});
                let question = questions.shift();
                if(!question){
                    res.status(404).json({message : 'not found'});
                }
                else{
                    let answers = await question.getAnswers({where : {id : req.params.aid}});
                    let answer = answers.shift();
                    if(!answer){
                        res.status(404).json({message : 'not found'});
                    }
                    else {
                        await answer.update(req.body);
                        res.status(202).json({message: 'accepted'});
                    }
                }
            }
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.delete('/categories/:cid/tests/:tid/questions/:qid/answers/:aid', async (req, res) => { // sterge o varianta de raspuns a unei anumite intrebari dintr un anume test
    try {
        let category = await Category.findById(req.params.cid);
        if(!category){
            res.status(404).json({message : 'not found'});
        }
        else{
            let tests = await category.getTests({where : {id : req.params.tid}});
            let test = tests.shift();
            if(!test){
                res.status(404).json({message : 'not found'});
            }
            else{
                let questions = await test.getQuestions({where : {id : req.params.qid}});
                let question = questions.shift();
                if(!question){
                    res.status(404).json({message : 'not found'});
                }
                else{
                    let answers = await question.getAnswers({where : {id : req.params.aid}});
                    let answer = answers.shift();
                    if(!answer){
                        res.status(404).json({message : 'not found'});
                    }
                    else {
                        await answer.destroy();
                        res.status(202).json({message: 'accepted'});
                    }
                }
            }
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.get('/users', async (req, res, next) => { // in aplicatie nu este necesar asa ceva, dar am facut o pentru a ne putea uita in data de baze ulterior in postman
    try{
        let users = await User.findAll();
        res.status(200).json(users);
    } catch(e){
        console.warn(e);
		res.status(500).json({message : 'server error'});
    }
});

app.get('/users/:id', async (req, res, next) => { // returneaza un anumit user
    try{
        let user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch(e){
        console.warn(e);
		res.status(500).json({message : 'server error'});
    }
});

app.post('/users', async (req, res) => { // cand se inregistreaza un user nou
	try{
		await User.create(req.body);
		res.status(201).json({message : 'created'});
	} catch(e){
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.put('/users/:id', async (req, res) => { // daca un user vrea sa isi schimbe numele, emailul, parola sau statutul de prof
	try{
		let user = await User.findById(req.params.id);
		if (user){
			await user.update(req.body);
			res.status(202).json({message : 'accepted'});
		}
		else{
			res.status(404).json({message : 'not found'});
		}
	} catch(e){
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.delete('/users/:id', async (req, res) => { // daca un user vrea sa isi stearga contul
	try{
		let user = await User.findById(req.params.id);
		if (user){
			await user.destroy();
			res.status(202).json({message : 'accepted'});
		}
		else{
			res.status(404).json({message : 'not found'});
		}
	} catch(e){
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.get('/users/:id/tests', async (req, res) => { // scoate o lista cu un user, incluzand si testele la care a participat acesta
	try {
		let user = await User.findById(req.params.id);
		if (user){
			let tests = await user.getTakenTests();
			res.status(200).json(tests);
		}
		else{
			res.status(404).json({message : 'not found'});
		}
	} catch (e) {
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.get('/users/:uid/tests/:tid', async (req, res) => { // returneaza un anumit taken test al unui anumit user
	try {
		let user = await User.findById(req.params.uid);
		if (user){
			let tests = await user.getTakenTests().findById(req.params.tid);
			res.status(200).json(tests);
		}
		else{
			res.status(404).json({message : 'not found'});
		}
	} catch (e) {
		console.warn(e);
		res.status(500).json({message : 'server error'});
	}
});

app.post('/users/:id/tests', async (req, res) => { // adauga un taken test unui user
    try {
        let user = await User.findById(req.params.id);
        if(user){
            let takenTest = req.body;
            takenTest.userId = user.id;
            await TakenTest.create(takenTest);
            res.status(201).json({message: 'created'});
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.put('/users/:uid/tests/:tid', async (req, res) => { // modifica un taken test unui user
    try {
        let user = await User.findById(req.params.uid);
        if(!user){
            res.status(404).json({message : 'not found'});
        }
        else{
            let takenTests = await user.getTakenTests({where : {id : req.params.tid}});
            let takenTest = takenTests.shift();
            if(!takenTest){
                res.status(404).json({message : 'not found'});
            }
            else{
                await takenTest.update(req.body);
                res.status(202).json({message: 'accepted'});
            }
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.delete('/users/:uid/tests/:tid', async (req, res) => { // sterge un taken test unui user
    try {
        let user = await User.findById(req.params.uid);
        if(!user){
            res.status(404).json({message : 'not found'});
        }
        else{
            let takenTests = await user.getTakenTests({where : {id : req.params.tid}});
            let takenTest = takenTests.shift();
            if(!takenTest){
                res.status(404).json({message : 'not found'});
            }
            else{
                await takenTest.destroy();
                await AnsweredQuestion.destroy({where : {takenTestId : req.params.tid}}); // se sterg si intrebarile aferente testului
                res.status(202).json({message: 'accepted'});
            }
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.get('/users/:uid/tests/:tid/questions', async (req, res) => { // returneaza intrebarile dintr-un taken test a unui user
    try{
        let answeredQuestions = await AnsweredQuestion.findAll({where : {takenTestId : req.params.tid}});
        if(!answeredQuestions){
            res.status(404).json({message : 'not found'});
        }
        else{
		    res.status(200).json(answeredQuestions);
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.get('/users/:uid/tests/:tid/questions/:aqid', async (req, res) => { // returneaza o intrebare anume dintr-un taken test a unui user cu tot cu raspuns
    try{
        let answeredQuestion = await AnsweredQuestion.findById(req.params.aqid);
        if(!answeredQuestion){
            res.status(404).json({message : 'not found'});
        }
        else{
		    res.status(200).json(answeredQuestion);
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.post('/users/:uid/tests/:tid/questions', async (req, res) => { // adauga intrebarile dintr-un taken test a unui user -> in req.body se va transmite id ul questionului pentru a face legatura (fk)
    try{ // put sau delete nu ar trebui sa existe aici asa ca nu le fac.. nu e logic sa pot sa sterg sau modific o parte din intrebarile unui test la care am participat sau raspunsurile la acestea
        let user = await User.findById(req.params.uid); 
        if(!user){
            res.status(404).json({message : 'not found'});
        }
        else{
            let takenTest = await user.getTakenTests({where : {id : req.params.tid}});
            if(!takenTest){
                res.status(404).json({message : 'not found'});
            }
            else{
                let answeredQuestion = req.body;
                answeredQuestion.takenTestId = req.params.tid;
                await AnsweredQuestion.create(answeredQuestion);
		        res.status(201).json({message : 'created'});
            }
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.get('/users/:uid/tests/:tid/questions/:aqid/answers', async (req, res) => { // returneaza intrebarile dintr-un taken test a unui user
    try{
        let question = await AnsweredQuestion.findById(req.params.aqid);
        if(!question){
            res.status(404).json({message : 'not found'});
        }
        else{
            let myAnswers = await MyAnswer.findAll();
            if(!myAnswers){
                res.status(404).json({message : 'not found'});
            }
            else{
    	        res.status(200).json(myAnswers);
            }
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.post('/users/:uid/tests/:tid/questions/:aqid/answers', async (req, res) => { // adauga raspunsul la intrebarile dintr-un taken test a unui user
    try{
        let question = await AnsweredQuestion.findById(req.params.aqid);
        if(!question){
            res.status(404).json({message : 'not found'});
        }
        else{
            let myAnswers = req.body;
            myAnswers.answeredQuestionId = req.params.aqid;
            await MyAnswer.create(myAnswers);
	        res.status(201).json({message : 'created'});
        }
    } catch (e) {
        console.warn(e);
        res.status(500).json({message : 'server error'});
    }
});

app.get('*', function(req, res){ // in cazul in care nicio ruta nu va fi accesata, se va intra aici
    res.status(404).send("404 NOT FOUND!\nAi navigat pe o pagina care nu exista!") ;
});

app.use((err, req, res, next) => { // afiseaza eroarea daca se intampla ceva gresit
  console.warn(err);
  res.status(500).send('some error');
});

app.listen(8080, function(){ // porneste serverul pe portul 8080
	console.log("server started on port 8080");
});