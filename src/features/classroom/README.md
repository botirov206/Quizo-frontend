# Classroom

Teacher and student classroom UI at `/classrooms`. **100% mock** — hooks sleep 500ms and mutate `data/mock-classrooms.ts` in memory.

## What the user sees

- **Teacher:** list, create (6-char code), copy code, student list + remove, results grid, delete class.
- **Student:** enrolled list, join by code, leave. “View Details” has no handler.

Role comes from `AuthContext`. Anyone who is not `teacher` gets the student view (including `admin`).

## Codes

Alphabet `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (no 0/O/1/I/L), length 6. Mock seed codes `ABC123` / `HIS456` violate that alphabet.

## File map

```
components/   ClassroomPage, TeacherClassroom, StudentClassroom, cards, dialogs, StudentList, ResultsGrid
hooks/        useClassrooms, useClassroomActions, useClassroomResults
data/         MOCK_CLASSROOMS, students, results
constants/    codes, query keys, messages
types/        Classroom, ClassroomStudent, ClassroomQuizResult
```

TODOs in the hooks still say “Replace with real API.” Backend phase B8 specifies `/api/v1/classrooms`.
