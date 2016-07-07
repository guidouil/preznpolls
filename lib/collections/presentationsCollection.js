Presentations = new Mongo.Collection('presentations');

Presentations.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
});

let AnswerSchema = new SimpleSchema({
  answerId: {
    type: String,
    label: 'Answer ID',
  },
  text: {
    type: String,
    label: 'Answer text',
    optional: true,
  },
  value: {
    type: String,
    label: 'Answer value (used for stats)',
    optional: true,
  },
  description: {
    type: String,
    label: 'Answer description',
    optional: true,
  },
  color: {
    type: String,
    label: 'Answer color',
    optional: true,
  },
  image: {
    type: String,
    label: 'Answer image',
    optional: true,
  },
  minValue: {
    type: Number,
    label: 'Answer minimal value (ex: 1)',
    optional: true,
  },
  maxValue: {
    type: Number,
    label: 'Answer maximal value (ex: 5)',
    optional: true,
  },
  isRightAnswer: {
    type: Boolean,
    label: 'This is a right answer',
    optional: true,
  },
  order: {
    type: Number,
    label: 'Answer order',
    optional: true,
  },
});

let QuestionSchema = new SimpleSchema({
  questionId: {
    type: String,
    label: 'Question ID',
  },
  text: {
    type: String,
    label: 'Question text',
    optional: true,
  },
  type: {
    type: String,
    label: 'Question type',
    allowedValues: [
      'singleChoiceQuestion',
      'multiChoicesQuestion',
      'multiPointsQuestion',
      'rangeQuestion',
      'wordsQuestion',
    ],
  },
  stat: {
    type: String,
    label: 'Question stat type',
    allowedValues: [
      'gaugeStat',
      'pieStat',
      'barStat',
      'columnStat',
      'cloudStat',
    ],
  },
  description: {
    type: String,
    label: 'Question description',
    optional: true,
  },
  help: {
    type: String,
    label: 'Question help (shown in a tooltip)',
    optional: true,
  },
  answers: {
    type: [AnswerSchema],
    label: 'Question answers',
  },
  minAnswers: {
    type: Number,
    label: 'Minimal answers count to validate this question (ex: 1)',
    optional: true,
  },
  maxAnswers: {
    type: Number,
    label: 'Maximum answers count to validate this question (ex: 3)',
    optional: true,
  },
  order: {
    type: Number,
    label: 'Question order',
    optional: true,
  },
});

let SlideSchema = new SimpleSchema({
  order: {
    type: Number,
    label: 'Slide order',
  },
  type: {
    type: String,
    label: 'Slide type',
    allowedValues: [
      'coverSlide',
      'textSlide',
      'pollSlide',
      'imageSlide',
      'videoSlide',
    ],
  },
  name: {
    type: String,
    label: 'Slide name',
    optional: true,
  },
  title: {
    type: String,
    label: 'Slide title',
    optional: true,
  },
  description: {
    type: String,
    label: 'Slide description',
    optional: true,
    autoform: {
      rows: 4,
    },
  },
  color: {
    type: String,
    label: 'Slide color',
    optional: true,
  },
  image: {
    type: String,
    label: 'Slide image url',
    optional: true,
  },
  video: {
    type: String,
    label: 'Slide video url',
    optional: true,
  },
  backgroundImage: {
    type: String,
    label: 'Slide background image',
    optional: true,
  },
  questions: {
    type: [QuestionSchema],
    label: 'Slide questions',
    optional: true,
  },
});

let ChapterSchema = new SimpleSchema({
  order: {
    type: Number,
    label: 'Chapter order',
  },
  title: {
    type: String,
    label: 'Chapter title',
    optional: true,
  },
  slides: {
    type: [SlideSchema],
    label: 'Slides',
    optional: true,
  },
});

let PresentationsSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Presentation title',
    optional: true,
  },
  description: {
    type: String,
    label: 'Presentation description',
    optional: true,
    autoform: {
      rows: 3,
    },
  },
  chapters: {
    type: [ChapterSchema],
    label: 'Chapters',
    optional: true,
  },
  owners: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false,
    },
    autoValue: function () { if (this.isInsert) { return [this.userId]; }}
  },
  users: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false,
    },
  },
  isPublic: {
    type: Boolean,
    label: 'Is presentation public',
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        return false;
      }
    },
  },
  chapterViewIndex: {
    type: Number,
    autoform: {
      type: 'hidden',
      label: false,
    },
    autoValue: function () {
      if (this.isInsert) {
        return 0;
      }
    },
  },
  slideViewIndex: {
    type: Number,
    autoform: {
      type: 'hidden',
      label: false,
    },
    autoValue: function () {
      if (this.isInsert) {
        return 0;
      }
    },
  },
  flip: {
    type: String,
    autoform: {
      type: 'hidden',
      label: false,
    },
    autoValue: function () {
      if (this.isInsert) {
        return 'ping';
      }
    },
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    },
    autoform: {
      omit: true,
    },
  },
  updatedAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert || this.isUpdate) {
        return new Date();
      }
    },
    optional: true,
    autoform: {
      omit: true,
    },
  },
});

Presentations.attachSchema(PresentationsSchema);
