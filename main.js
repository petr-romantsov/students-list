
//первоначальный массив студентов 
let studentsList = [
    {
        lastName: 'Романцов', 
        name: 'Петр',
        surname: 'Сергеевич',
        dateOfBirth: new Date(1991, 8, 17), 
        startYear: 2022,
      
        faculty: 'Физкультура',
    }, 
    {
        lastName: 'Иванов', 
        name: 'Алексей',
        surname: 'Антонович',
        dateOfBirth: new Date (2000, 7, 13), 
        startYear: 2017,
        faculty: 'Маркетинг',
    }, 
    {
        lastName: 'Стрельцов', 
        name: 'Эдуард',
        surname: 'Алексеевич',
        dateOfBirth: new Date(2001, 6, 10), 
        startYear: 2019,
        faculty: 'Физкультура',
    }, 
    {
        lastName: 'Караваева', 
        name: 'Анастасия',
        surname: 'Семеновна',
        dateOfBirth: new Date(2002, 1, 1), 
        startYear: 2015,
        faculty: 'Маркетинг',
    }, 
]

//получаем данные из localStorage
let localData = localStorage.getItem('students');

//проверка если в localStorage не пустота, то рассшифровываем данные и переписываем в основной массив
if (localData !== null && localData !== '') { 
    studentsList = JSON.parse(localData, (key, value) => { 
        if (key == 'dateOfBirth') return new Date(value);
        return value;
    }); 
}

//переменная тела таблицы
const studentsTable = document.getElementById('table-body');

//переменные формы добавления студентов
const addStudentForm = document.getElementById('addStudent-form'),
    lastNameInput = document.getElementById('lastName-input'),
    nameInput = document.getElementById('name-input'),
    surnameInput = document.getElementById('surname-input'),
    dateOfBirthInput = document.getElementById('dateOfBirth-input'),
    startYearInput = document.getElementById('startYear-input'),
    facultyInput = document.getElementById('faculty-input'),
    formButton = document.getElementById('form-button'),
    buttonWrapper = document.getElementById('button-wrapper');

//переменные ячеек с заголовками 
const fioTH = document.getElementById('th-fio'),
    facultyTH = document.getElementById('th-faculty'),
    dateOfBirthTH = document.getElementById('th-dateOfBirth'),
    yearsTH = document.getElementById('th-years');

//переменные сортировки
let sortColumnHeader = 'fio';    
let direction = true;

//переменные формы фильтрации 
const filterForm = document.getElementById('filter-form'),
    filterFioInp = document.getElementById('filter-fioInp'),
    filterFacultyInp = document.getElementById('filter-facultyInp'), 
    filterStartInp = document.getElementById('filter-startYearInp'), 
    filterFinishInp = document.getElementById('filter-finishYearInp');
    
//функция получения объединненного ФИО
function getFIO(studentObj) { 
    studentObj.fio = studentObj.lastName + ' ' + studentObj.name + ' ' + studentObj.surname;
    return studentObj.fio;
}

//функция получения факультета
function getFaculty(studentObj) {   
    return studentObj.faculty;
}

//функция получения строки после возраста
function getStringAfterAge(age) { 
    let count = age % 100;
    
    if (count >= 10 && count <= 20) { 
        return 'лет';
    } else { 
        count = age % 10;
        if (count === 1) { 
            return 'год';
        } else if (count >= 2 && count <= 4) { 
            return 'года';
        } else { 
            return 'лет';
        }
    }
}

//функция получения возраста
function getAge(studentObj) { 
    let currentTime = new Date(); //Текущяя дата
    let today = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate()); //Текущяя дата без времени
    let dateOfBirth = studentObj.dateOfBirth;//Дата рождения
    let dateOfBirthInCurrentYear = new Date(today.getFullYear(), dateOfBirth.getMonth(), dateOfBirth.getDate()); //ДР в текущем году
    let age; //Возраст

    let yyyy = studentObj.dateOfBirth.getFullYear();
    let mm = studentObj.dateOfBirth.getMonth() + 1;
    let dd = studentObj.dateOfBirth.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    let stringDateOfBirth = `${dd}.${mm}.${yyyy}`;
    
    //Возраст = текущий год - год рождения
    age = today.getFullYear() - yyyy;
    //Если ДР в этом году ещё предстоит, то вычитаем из age один год
    if (today < dateOfBirthInCurrentYear) {
        age = age - 1;
    }

    return stringDateOfBirth + `(${age} ${getStringAfterAge(age)})`;
}

//функция получения периода обучения
function getPeriodOfStudy (studentObj) { 

    let currentTime = new Date();
    let currentYear = currentTime.getFullYear();
    
    let periodOfStudy = studentObj.startYear + ' - ' + studentObj.finishYear;
    let controlSeptember = new Date(studentObj.finishYear, 8);

    switch (currentYear - studentObj.startYear) { 
        case 0:
        case 1: 
        periodOfStudy = studentObj.startYear + ' - ' + studentObj.finishYear + ' (1 курс)';
        break;

        case 2: 
        periodOfStudy = studentObj.startYear + ' - ' + studentObj.finishYear + ' (2 курс)';
        break;

        case 3: 
        periodOfStudy = studentObj.startYear + ' - ' + studentObj.finishYear + ' (3 курс)';
        break;

        case 4: 
        periodOfStudy = studentObj.startYear + ' - ' + studentObj.finishYear + ' (4 курс)';
        break;
    }

    if (currentTime > controlSeptember) { 
        periodOfStudy = studentObj.startYear + ' - ' + studentObj.finishYear + ' (закончил)';
    }

    return periodOfStudy;
}

//функция создания строки студента 
function getStudentItem(studentObj) {
    //создаем элемент строку таблицы 
    const studentTR = document.createElement('tr');
    const fioTD = document.createElement('td');
    const facultyTD = document.createElement('td');
    const dateOfBirthTD = document.createElement('td');
    const yearsTD = document.createElement('td');

    //присваиваем ячейкам значения из объекта с использованием созданных функций 
    fioTD.textContent = getFIO(studentObj);
    facultyTD.textContent = getFaculty(studentObj);
    dateOfBirthTD.textContent = getAge(studentObj);
    yearsTD.textContent = getPeriodOfStudy(studentObj);

    //добавляем ячейки в строку
    studentTR.append(fioTD);
    studentTR.append(facultyTD);    
    studentTR.append(dateOfBirthTD);
    studentTR.append(yearsTD);

    //возвращаем строку
    return studentTR;
}

//функция создания сообщения об ошибке
function createError(input, label, errorText) { 
    const error = document.createElement('p');
    error.classList.add('error-message');
    error.textContent = errorText;
    error.style.color = 'red';
    buttonWrapper.prepend(error);
}

//функция фильтрации списка
function filter(arr, prop, value) { 
    let filteredList = [],
        copy = [...arr];
    for (const item of copy) { 
        if (String(item[prop]).toLowerCase().includes(value.toLowerCase()) == true) filteredList.push(item);
    }
    return filteredList;
}

//функция сохранения массива в localStorage
function saveList(arr, listName) { 
    localStorage.setItem(listName, JSON.stringify(arr));
}

//функция рендера массива студентов в таблицу
function renderStudentsTable(studentsArray) {
    //очистка таблицы 
    studentsTable.innerHTML = '';

     //создаем копию основного массива
     let copyStudentsList = [...studentsArray];

    //добавляем в объекты ключи fio и finishYear, чтобы работали сортировка и фильтрация
    for (let student of copyStudentsList) { 
    student.fio = getFIO(student);
    student.finishYear = student.startYear + 4; 
    }

    //сортировка
    copyStudentsList = copyStudentsList.sort(function (a, b){ 
        let dirCondition = a[sortColumnHeader] < b[sortColumnHeader];
        if (direction == true) dirCondition = a[sortColumnHeader] > b[sortColumnHeader];
        if (dirCondition == true) return -1;
    });

    //фильтрация 
    if (filterFioInp.value.trim() !== '') copyStudentsList = filter(copyStudentsList, 'fio', filterFioInp.value);
    if (filterFacultyInp.value.trim() !== '') copyStudentsList = filter(copyStudentsList, 'faculty', filterFacultyInp.value);
    if (filterStartInp.value.trim() !== '') copyStudentsList = filter(copyStudentsList, 'startYear', filterStartInp.value);
    if (filterFinishInp.value.trim() !== '') copyStudentsList = filter(copyStudentsList, 'finishYear', filterFinishInp.value);

    //добавление элементов на страницу
    for (student of copyStudentsList) { 
        studentsTable.append(getStudentItem(student));
    }
}

//событие отправки формы добавления студента
addStudentForm.addEventListener('submit', (e) => { 
    e.preventDefault();

    //переменные формы
   const allInputs = addStudentForm.querySelectorAll('input'),
        verificationDate = new Date(1900, 0, 1),
        currentDate = new Date(),
        dobInputValue = new Date(dateOfBirthInput.value),
        syInputValue = new Date(startYearInput.value),
        dobFieldName = dateOfBirthInput.previousElementSibling.textContent,
        syFieldName = startYearInput.previousElementSibling.textContent;
    
   //цикл для проверки всех инпутов на заполненность
   for (input of allInputs) {

        //переменная для вывода названия поля, в котором ошибка
        const fieldName = input.previousElementSibling.textContent;

        //очистка ошибок
        if (input.classList.contains('error')) { 
            input.classList.remove('error');
            addStude
            ntForm.querySelector('.error-message').remove();
        }
        //проверка на заполненность
        if (input.value.trim() == '') { 
            createError(input, fieldName, `Поле "${fieldName}" не заполнено!`);
            input.classList.add('error');
            return;
        }
    }
   //проверка даты рождения
    if (dobInputValue.getTime() < verificationDate.getTime()) { 
        createError(dateOfBirthInput, dobFieldName, `${dobFieldName} не может быть раньше 01.01.1900`);
        dateOfBirthInput.classList.add('error');
        return;
    } else if (dobInputValue.getTime() > currentDate.getTime()) { 
        createError(dateOfBirthInput, dobFieldName, `${dobFieldName} не может быть позже текущей даты`);
        dateOfBirthInput.classList.add('error');
        return;
    }
    //проверка года начала обучения
    if (syInputValue.getFullYear() < new Date(2000)) { 
        createError(startYearInput, syFieldName, `${syFieldName} не может быть раньше 2000-го`);
        startYearInput.classList.add('error');
        return;
    } else if (syInputValue.getFullYear() > currentDate.getFullYear()) { 
        createError(startYearInput, syFieldName, `${syFieldName} не может быть позже текущего`);
        startYearInput.classList.add('error');
        return;
    }

    //добавление студента в массив
    studentsList.push ({ 
        lastName: lastNameInput.value.trim(), 
        name: nameInput.value.trim(),
        surname: surnameInput.value.trim(),
        dateOfBirth: new Date(dateOfBirthInput.value.trim()), 
        startYear: parseInt(startYearInput.value.trim()),
        faculty: facultyInput.value.trim(),
    });

    //сохранение массива в LS // очистка таблицы //очистка полей формы добавления студента
    saveList(studentsList, 'students');
    studentsTable.innerHTML = '';
    lastNameInput.value = '';
    nameInput.value= '';
    surnameInput.value = '';
    dateOfBirthInput.value = '';
    startYearInput.value = '';
    facultyInput.value = '';

    //отрисовка новой таблицы с добавленным студентом
    renderStudentsTable(studentsList);
})

//клики сортировки
fioTH.addEventListener('click',() => { 
    sortColumnHeader = 'fio';
    direction = !direction;
    renderStudentsTable(studentsList);
});

facultyTH.addEventListener('click', () => { 
    sortColumnHeader = 'faculty';
    direction = !direction;
    renderStudentsTable(studentsList);
});

dateOfBirthTH.addEventListener('click', () => {
    sortColumnHeader = 'dateOfBirth';
    direction = !direction;
    renderStudentsTable(studentsList);
});

yearsTH.addEventListener('click', () => {
    sortColumnHeader = 'startYear';
    direction = !direction;
    renderStudentsTable(studentsList);
});

//события инпутов для фильтрации списка при вводе в инпут
filterForm.addEventListener('submit', (e) => { 
    e.preventDefault();
});

filterFioInp.addEventListener('input', () => {
    renderStudentsTable(studentsList)
});

filterFacultyInp.addEventListener('input', () => {
    renderStudentsTable(studentsList)
});

filterStartInp.addEventListener('input', () => {
    renderStudentsTable(studentsList)
});

filterFinishInp.addEventListener('input', () => {
    renderStudentsTable(studentsList)
});

renderStudentsTable(studentsList);
