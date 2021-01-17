import {Request} from "./requests";
import {UI} from "./ui";

const form = document.getElementById("employee-form");
const nameInput = document.getElementById("name");
const departmentInput = document.getElementById("department");
const salaryInput = document.getElementById("salary");
const updateEmployeeButton = document.getElementById("update");
const employeesList = document.getElementById("employees");

const request = new Request("http://localhost:3000/employees");
const ui = new UI();

let updateState = null;

eventListeners();

function eventListeners()
{
    document.addEventListener("DOMContentLoaded",getAllEmployees);
    form.addEventListener("submit",addEmployee);
    employeesList.addEventListener("click",UpdateOrDelete);
    updateEmployeeButton.addEventListener("click",updateEmployee);
}


function UpdateOrDelete(e)
{
    if(e.target.id === "delete-employee")
    {
        //Silme
        deleteEmployee(e.target);//e.target = silme butonu
    }
    else if(e.target.id === "update-employee")
    {
        //Guncelleme
        updateEmployeeController(e.target.parentElement.parentElement);
    }
}

function updateEmployeeController(targetEmployee)
{
   ui.toggleUpdateButton(targetEmployee);

   if(updateState === null)
   {
       updateState = {
           updateId: targetEmployee.children[3].textContent,
           updateParent: targetEmployee // o anki tr'mizi veriyoruz
       }
   }
   else{
       updateState = null;
   }
}

function updateEmployee()
{
    if(updateState) // Bir veri tutuyorsa calisacaktir(true)
    {
       const data = {
           name: nameInput.value.trim(),
           department: departmentInput.value.trim(),
           salary: Number(salaryInput.value.trim())
       };
       request.put(updateState.updateId,data)
       .then(updatedEmployee =>
        {
           ui.updateEmployeeOnUI(updatedEmployee,updateState.updateParent);
        })
       .catch(err => console.log(err));
       
    }
}

function deleteEmployee(targetEmployee)//targetEmployee = silme butonu
{
    const id = targetEmployee.parentElement.previousElementSibling.previousElementSibling.textContent;
    request.delete(id)
    .then(message => {
        ui.deleteEmployeeFromUI(targetEmployee.parentElement.parentElement);
    })
    .catch(err => console.log(err));
}

function addEmployee(e)
{
    const nameEmployee = nameInput.value.trim();
    const departmentEmployee = departmentInput.value.trim();
    const salaryEmployee = salaryInput.value.trim();
    if(nameEmployee === "" || departmentEmployee === "" || salaryEmployee === "")
    {
        alert("Lutfen tum alanlari doldurun");
    }
    else{

        request.post({

            name:nameEmployee,
            department :departmentEmployee,
            salary:Number(salaryEmployee)
        })
        .then(employee =>
            {
                ui.addEmployeeToUI(employee);
            })
        .catch(err =>console.log(err));
    }
    
    ui.clearInputs();
    e.preventDefault();

}
    

function getAllEmployees()
{
    request.get()
    .then(employees =>
        {
           ui.addAllEmployeeToUI(employees);
        })
    .catch(err => console.log(err));
}

//Get Request
/*
request.get()
.then(employees => console.log(employees))
.catch(err => console.log(err));  

//Post Request
/*request.post({
    name:"Hasan Coskun",
    department:"Insan Kaynaklari",
    salary:"4000"
})
.then(employee => console.log(employee))
.catch(err => console.log(err));  */

//Put Request
/*request.put(2,{
    name:"Hakan Coskun",
    department:"Bilisim",
    salary:"4000"
})
.then(employee => console.log(employee))
.catch(err => console.log(err));  

//Delete Request
request.delete(3)
.then(message => console.log(message))
.catch(err => console.log(err));
*/