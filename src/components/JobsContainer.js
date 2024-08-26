import { useEffect } from "react";
import Job from "./Job";
import Wrapper from "../assets/wrappers/JobsContainer";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./Loading";
import { getAllJobs } from "../features/allJobs/allJobsSlice";
import PageBtnContainer from "./PageBtnContainer";

export default function JobsContainer() {
  const {
    jobs,
    isLoading,
    page,
    totalJobs,
    numOfPages,
    searchStatus,
    sort,
    searchType,
    search,
  } = useSelector((store) => store.allJobs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllJobs());
  }, [page, searchStatus, sort, searchType, search]);

  if (isLoading) {
    return (
      <Wrapper>
        <Loading center />
      </Wrapper>
    );
  }
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>Nessun lavoro trovato</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h5>
        {totalJobs} {totalJobs > 1 ? "Jobs" : "Job"}
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job.id} {...job} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
}
