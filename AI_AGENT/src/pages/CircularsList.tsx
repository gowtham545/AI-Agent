import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import type { Circular, CircularCategory, CircularStatus, PriorityLevel } from '../types';
import { CircularCard } from '../components/ui/CircularCard';
import { CircularTable } from '../components/ui/CircularTable';
import { 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon, 
  PlusCircle, 
  X, 
  SlidersHorizontal,
  ArrowUpDown,
  FileSpreadsheet,
  Download,
  Bot
} from 'lucide-react';

export const CircularsList: React.FC = () => {
  const { circulars } = useDatabase();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = [
    'All',
    'Policy & Compliance',
    'Safety & Security',
    'Financial & Delegation',
    'Operations & Logistics',
    'IT & Data Governance',
    'HR & Workforce',
  ];

  const statuses = ['All', 'Active', 'Draft', 'Under Review', 'Superseded', 'Archived'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filteredCirculars = circulars.filter((c) => {
    const matchesSearch =
      c.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setPriorityFilter('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Circular Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, search, and inspect binding institutional directives and historical versions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.canUploadDocuments ? (
            <Link
              to="/circulars/new"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              New Circular
            </Link>
          ) : (
            <Link
              to="/assistant"
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-medium text-xs flex items-center gap-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              Ask Cira Copilot
            </Link>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circular title, Ref No, tag..."
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle & Counter */}
          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
            <span className="text-xs text-slate-400 font-mono">
              Showing <strong className="text-slate-200">{filteredCirculars.length}</strong> of {circulars.length} circulars
            </span>

            <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Multi-faceted Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/60 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            Filters:
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            {statuses.filter((s) => s !== 'All').map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Categories</option>
            {categories.filter((c) => c !== 'All').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Priorities</option>
            {priorities.filter((p) => p !== 'All').map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {(statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' || searchQuery !== '') && (
            <button
              onClick={clearFilters}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors ml-auto"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Grid / Table Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCirculars.map((circ) => (
            <CircularCard key={circ.id} circular={circ} />
          ))}
          {filteredCirculars.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 glass-card rounded-xl">
              No circulars found matching your selected filters.
            </div>
          )}
        </div>
      ) : (
        <CircularTable circulars={filteredCirculars} />
      )}
    </div>
  );
};
