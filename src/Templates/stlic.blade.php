@extends(xMailBIL('c3R2OjpzdG1z'))
@section('title', xMailBIL('TGljZW5zZQ=='))
@section(xMailBIL('Y29udGVudA=='))
<div class="wizard-step-3 d-block">
    <form action="{{ route('install.license.setup') }}" method="POST">
        @csrf
        @method('POST')
        <div class="row">
            <div class="database-field col-md-12">
                <h6>Please enter Envato username and purchase code for verification</h6>
                <div class="form-group form-row mb-3">
                    <label>Envato Username<span class="required-fill">*</span></label>
                    <div>
                        <input type="text" name="envato_username" value="{{ old('envato_username') }}"
                            class="form-control" autocomplete="off">
                        @if ($errors->has('envato_username'))
                            <span class="text-danger">{{ $errors->first('envato_username') }}</span>
                        @endif
                    </div>
                </div>
                <div class="form-group form-row mb-3">
                    <label class="col-lg-3">Envato Purchase Code<span class="required-fill">*</span></label>
                    <div class="col-lg">
                        <input type="text" name="license" value="{{ old('license') ? old('license') : '' }}"
                            class="form-control" placeholder="" autocomplete="off">
                        @if ($errors->has('license'))
                            <span class="text-danger">{{ $errors->first('license') }}</span>
                        @endif
                    </div>
                </div>
            </div>
        </div>
        <div class="mb-3">
            If you don't know how to get purchase code, click here:
            <a href="https://help.market.envato.com/hc/en-us/articles/202822600-Where-Is-My-Purchase-Code">
                where is my purchase code
            </a>
        </div>
        <div class="next-btn d-flex">
            <a href="{{ route('install.license') }}" class="btn btn-primary">
                <i class="far fa-hand-point-left me-2"></i> Previous
            </a>
            <a href="javascript:void(0)" class="btn btn-primary submit-form">
                Next <i class="far fa-hand-point-right ms-2"></i>
            </a>
        </div>
    </form>
</div>
@endsection
@section('scripts')
<script>
    $(".submit-form").click(function() {
        $("form").submit();
    });
</script>
@endsection
