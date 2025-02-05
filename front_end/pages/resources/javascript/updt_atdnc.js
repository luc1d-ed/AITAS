const cards = document.querySelectorAll(".card")
const id=0,state=0;
const data ={
    id0: {
      id: 7711,
      name: "Dwight",
      state: 1,
      absent_days: 25
    }
  ,
    id1: {
      id: 1521,
      name: "Tanitansy",
      state: 1,
      absent_days: 23
    }
  ,
    id2: {
      id: 5899,
      name: "Roderick",
      state: 0,
      absent_days: 27
    }
  ,
    id3: {
      id: 9531,
      name: "Krystle",
      state: 1,
      absent_days: 2
    }
  ,
    id4: {
      id: 8102,
      name: "Justen",
      state: 0,
      absent_days: 20
    }
  ,
    id5: {
      id: 1106,
      name: "Corny",
      state: 1,
      absent_days: 20
    }
  ,
    id6: {
      id: 1196,
      name: "Elliot",
      state: 0,
      absent_days: 19
    }
  ,
    id7: {
      id: 2661,
      name: "Isabelita",
      state: 1,
      absent_days: 31
    }
  ,
    id8: {
      id: 9828,
      name: "Sigfried",
      state: 1,
      absent_days: 6
    }
  ,
    id9: {
      id: 5026,
      name: "Aguistin",
      state: 1,
      absent_days: 11
    }
  ,
    id10: {
      id: 3858,
      name: "Letty",
      state: 0,
      absent_days: 31
    }
  ,
    id11: {
      id: 2483,
      name: "Marley",
      state: 1,
      absent_days: 26
    }
  ,
    id12: {
      id: 3084,
      name: "Anestassia",
      state: 0,
      absent_days: 13
    }
  ,
    id13: {
      id: 2070,
      name: "Erin",
      state: 1  ,
      absent_days: 12
    }
  ,
    id14: {
      id: 2644,
      name: "Xavier",
      state: 0,
      absent_days: 6
    }
  }

  let count = 0;






















///function to update the front-end with the data of students
  function change_state(){
    cards.forEach((card,index)=>{
        const student = data["id"+index]
        if(student["state"]===0){
            student["absent_days"]=parseInt(student["absent_days"]+1)
            card.classList.remove("card")
            card.classList.add("card-absent")
            count=count+1;
        }
        const cnt = document.getElementById("cnt")
        cnt.innerText=16-count;
        const card_item = card.childNodes;
        const name = document.querySelectorAll(".name")[index];
        name.innerHTML=student["name"]
        const absent_days = card_item[5];
        absent_days.childNodes[1].innerText=student["absent_days"];
    })
}

async function runall() {
  await change_state()
  // change_state()
}
runall()
const name = document.querySelectorAll(".name")[1];
