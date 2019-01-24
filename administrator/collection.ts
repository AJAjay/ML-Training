

export class Manipulate {

  slider_value: string[] = ["Poor", "Need Improvement", "Satisfactory", "Good", "VeryGood"];
  constructor(private userService: any) { }
  //store the structure in the statics collection intialized with zero
  manipulateData(value, data_template, id) {
    let result: any;
    let slider_value: string[] = ["Poor", "Need Improvement", "Satisfactory", "Good", "VeryGood"];

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
      surveyName: data_template.surveyName, topics: temp_topics, average: 0, attended: 0, template_id: id
    }
    console.log(result)
    this.userService.storeBaseStatics(result).subscribe(
      data => {
        // console.log(data)
      })
    this.userService.storeDataTemplate(result).subscribe()
  }


  //add all the users data
  addFeedbacks(records, template) {
    let lables, attended = records.length;
    let slider;
    //calculate the result for all who attended the survey
    // for (let record of records) {

    //   for (let topic_index = 0; topic_index < record.topics.length; topic_index++) {

    //     for (let q_index = 0; q_index < record.topics[topic_index].questions.length; q_index++) {

    //       if (record.topics[topic_index].questions[q_index].question_type != 'textField') {
    //         lables = Object.keys(record.topics[topic_index].questions[q_index].options)

    //         for (let lable of lables) {

    //           template.topics[topic_index].questions[q_index].options[lable] += record.topics[topic_index].questions[q_index].options[lable];
    //         }
    //       } else {
    //         template.topics[topic_index].questions[q_index].options.push(record.topics[topic_index].questions[q_index].options)
    //       }
    //     }
    //   }
    // }
    for (let record of records) {
      template = this.changeValue(template,record)
    }
    console.log(template)
    return template;
  }

  //value is calculated and updated in the statics collection
  changeValue(db_result, surveyResult) {
    let sliderLength = 0, sum, temp = 0, lables;
    db_result.attended += 1
    let total_value = 0, slider_sum = 0, sliderque_len = 0, topic_value;
    for (let i = 0; i < db_result.topics.length; i++) {
      sliderLength = 0;
      sum = 0
      topic_value = 0
      for (let j = 0; j < db_result.topics[i].questions.length; j++) {
        if (db_result.topics[i].questions[j].question_type != "textField") {
          lables = Object.keys(surveyResult.topics[i].questions[j].options)
          if (db_result.topics[i].questions[j].question_type == "slider") {
            sliderque_len += 1
            sliderLength++
            for (let k = 0; k < lables.length; k++) {
              db_result.topics[i].questions[j].options[lables[k]] += surveyResult.topics[i].questions[j].options[lables[k]]
              sum += (this.slider_value.indexOf(lables[k]) + 1)
            }


            lables = Object.keys(db_result.topics[i].questions[j].options)
            for (let k = 0; k < lables.length; k++) {
              temp = (this.slider_value.indexOf(lables[k]) + 1) * db_result.topics[i].questions[j].options[lables[k]]
              total_value += temp;
              topic_value += temp;
            }
          }
          else {
            for (let k = 0; k < lables.length; k++) {
              db_result.topics[i].questions[j].options[lables[k]] += surveyResult.topics[i].questions[j].options[lables[k]]
            }
          }
        } else {
          db_result.topics[i].questions[j].options.push(surveyResult.topics[i].questions[j].options);

        }
      }
      slider_sum += sum;
      surveyResult.topics[i].sliderAverage = Math.round(sum / sliderLength);
      db_result.topics[i].sliderAverage = Math.round(topic_value / (db_result.attended * sliderLength))
    }
    surveyResult.overallAverage = Math.round(slider_sum / sliderque_len)
    db_result.average = Math.round(total_value / (db_result.attended * sliderque_len))
    return db_result;
  }
}
