


export interface Questions {
    question: string;
    question_type: string;
    options: Map<string, number>
}



export interface Topic {
    topic: string;
    questions: Questions[]
}

export interface Result {
    userID: string;
    supervisor_email: string;
    surveyName: string;
    topics: Topic[]
}

export class Manipulate {

constructor(private userService : any){}
     //store the structure in the statics collection intialized with zero
  manipulateData(value,data_template) {
    let result: any;
    let slider_value: string[] =  ["Poor", "Need Improvement", "Satisfactory", "Good", "VeryGood"];

    let temp_topics: any;
    temp_topics = []

    let data = value;
    let i = 0

    for (let t of data) {
      temp_topics[i] = {}
      temp_topics[i].topic = t.topic
      let j = 0
      let questions: any = []

      for (let r of t.questions) {
        questions[j] = {}
        questions[j].question = r.question
        questions[j].question_type = r.questionType
        //to store for slider 
        if (r.questionType == "slider") {
          questions[j].options = {}
          for (let obj of slider_value) {
            questions[j].options[obj] = 0

          }
        } else if (r.questionType == "textField") {
          questions[j].options = [] //text field is stored as array 
        } else {
          questions[j].options = {}
          for (let o of r.options) {
            questions[j].options[o.option] = 0
          }
        }
        j++;
      }
      temp_topics[i].questions = questions
      i++;
    }
    result = {
      userID: data_template.userID,
      surveyName: data_template.surveyName, topics: temp_topics, average: 0, attended: 0
    }
    console.log(result)
    this.userService.storeBaseStatics(result).subscribe(
      data => {
       // console.log(data)
      })
  }

  // calculateAverage()
}