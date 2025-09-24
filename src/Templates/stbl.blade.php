@extends('stv::stmv')
@section('title', 'Verify')
@section('content')
    <div>
        <form action="{{ route('install.unblock') }}" method="POST">
            @csrf
            @method('POST')
            <div class="row">
                <div class="database-field col-md-12">
                    <h6>Your Current license is Blocked. Please enter new license details below for active license.</h6>

                    <div class="form-group form-row">
                        <label>Envato Username<span class="required-fill">*</span></label>
                        <div>
                            <input type="text" name="envato_username" value="{{ old('envato_username') }}" class="form-control" autocomplete="off">
                            @if ($errors->has('envato_username'))
                                <span class="text-danger">{{ $errors->first('envato_username') }}</span>
                            @endif
                        </div>
                    </div>

                    <div class="form-group form-row">
                        <label>License Code<span class="required-fill">*</span></label>
                        <div>
                            <input type="text" name="license" value="{{ old('license') }}" class="form-control" autocomplete="off">
                            @if ($errors->has('license'))
                                <span class="text-danger">{{ $errors->first('license') }}</span>
                            @endif
                        </div>
                    </div>
                    <div>
                        If you don't know how to get purchase code, click here: <a href="https://help.market.envato.com/hc/en-us/articles/202822600-Where-Is-My-Purchase-Code"> where is my purchase code </a>
                    </div>
                </div>
            </div>
        </form>
        <div class="next-btn d-flex">
            <a href="javascript:void(0)" class="btn btn-primary sumit-form">Active <i class="far fa-hand-point-right ms-2"></i></a>
        </div>
    </div>
@endsection
@section('scripts')
    <script>
        $(".sumit-form").click(function() {
            $("form").submit();
        });
    </script>
@endsection
