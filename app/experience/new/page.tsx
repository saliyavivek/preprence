import { prisma } from "@/lib/prisma";
import { createExperience } from "./actions";

export default async function NewExperiencePage() {
  const companies = await prisma.company.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main>
      <h1>Submit Interview Experience</h1>

      <form action={createExperience}>
        <div>
          <label htmlFor="companyId">Company</label>

          <select
            id="companyId"
            name="companyId"
            required
          >
            <option value="">Select company</option>

            {companies.map((company) => (
              <option
                key={company.id}
                value={company.id}
              >
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="degree">Degree</label>
          <input
            id="degree"
            name="degree"
            placeholder="MCA"
            required
          />
        </div>

        <div>
          <label htmlFor="graduationYear">Graduation Year</label>
          <input
            id="graduationYear"
            name="graduationYear"
            type="number"
            placeholder="2027"
            required
          />
        </div>

        <div>
          <label htmlFor="roleTitle">Role</label>
          <input
            id="roleTitle"
            name="roleTitle"
            placeholder="Systems Engineer"
            required
          />
        </div>

        <div>
          <label htmlFor="interviewDate">Interview Date</label>
          <input
            id="interviewDate"
            name="interviewDate"
            type="date"
            required
          />
        </div>

        <div>
          <label htmlFor="verdict">Verdict</label>

          <select
            id="verdict"
            name="verdict"
          >
            <option value="">Prefer not to say</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
            <option value="not_disclosed">Not disclosed</option>
          </select>
        </div>

        <div>
          <label htmlFor="overallTips">Overall Tips</label>
          <textarea
            id="overallTips"
            name="overallTips"
            placeholder="Share any useful advice..."
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="isAnonymous"
            />
            Submit anonymously
          </label>
        </div>

        <button type="submit">Submit Experience</button>
      </form>
    </main>
  );
}
