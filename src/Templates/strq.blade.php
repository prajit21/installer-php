@extends('stv::stms')
@section('title', 'Requirements')
@section('content')
    <div class="wizard-step-1 d-block">
        <h6>Please make sure the PHP extensions listed below are installed</h6>
        <div class="table-responsive custom-scrollbar">
            <table class="table">
                <thead>
                    <tr>
                        <th>Extensions</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($configurations as $configuration => $isCheck)
                        <tr>
                            <td>{{ $configuration }}</td>
                            <td class="icon-success">
                                <i class="fa-solid fa-{{ $isCheck ? 'check' : 'times' }}"></i>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
    <div class="next-btn text-right mt-3">
        @if ($configured)
            <a href="{{ route('install.directories') }}" class="btn btn-primary">
                Next <i class="far fa-hand-point-right ms-2"></i>
            </a>
        @else
            <a href="javascript:void(0)" class="btn btn-primary disabled">
                Next <i class="far fa-hand-point-right ms-2"></i>
            </a>
        @endif
    </div>
@endsection
