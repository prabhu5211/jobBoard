import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api.js';

export const fetchJobs = createAsyncThunk('jobs/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/jobs', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs');
  }
});

export const fetchJobById = createAsyncThunk('jobs/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/jobs/${id}`);
    return data.job;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch job');
  }
});

export const createJob = createAsyncThunk('jobs/create', async (jobData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/jobs', jobData);
    return data.job;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create job');
  }
});

export const updateJob = createAsyncThunk('jobs/update', async ({ id, jobData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/jobs/${id}`, jobData);
    return data.job;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update job');
  }
});

export const deleteJob = createAsyncThunk('jobs/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/jobs/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete job');
  }
});

export const fetchMyJobs = createAsyncThunk('jobs/fetchMyJobs', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/jobs/my-jobs');
    return data.jobs;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch your jobs');
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    currentJob: null,
    myJobs: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
    filters: {
      keyword: '',
      location: '',
      jobType: '',
      locationType: '',
      experienceLevel: '',
      category: '',
      minSalary: '',
      maxSalary: '',
      sort: '-createdAt',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        keyword: '',
        location: '',
        jobType: '',
        locationType: '',
        experienceLevel: '',
        category: '',
        minSalary: '',
        maxSalary: '',
        sort: '-createdAt',
      };
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchJobById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchJobById.fulfilled, (state, action) => { state.loading = false; state.currentJob = action.payload; })
      .addCase(fetchJobById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createJob.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateJob.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = state.myJobs.map((j) => (j._id === action.payload._id ? action.payload : j));
        if (state.currentJob?._id === action.payload._id) state.currentJob = action.payload;
      })
      .addCase(updateJob.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(deleteJob.pending, (state) => { state.loading = true; })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = state.myJobs.filter((j) => j._id !== action.payload);
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMyJobs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = action.payload;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { setFilters, clearFilters, clearCurrentJob, clearError } = jobSlice.actions;
export default jobSlice.reducer;
